const express = require("express");
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { randomUUID } = require("node:crypto");
const sharp = require("sharp");
const mongoose = require("mongoose");

// Exercise the real upload parser without importing unrelated application services.
jest.mock("../src/services", () => ({
  sendResponse: (res, status, message) => res.status(status).json({ message }),
}));
jest.mock("../src/services/logHandlers/HandleWinston", () => ({
  logger: { log: jest.fn(), error: jest.fn() },
}));
// Generate real email messages in memory, without connecting to an SMTP server.
jest.mock("../config/emails/nodemailer.config", () => ({
  nodemailerTransporter: require("nodemailer").createTransport({
    streamTransport: true,
    buffer: true,
  }),
}));

const { initializeMulter } = require("../config/multer/multer.config");
const { nodemailerTransporter } = require("../config/emails/nodemailer.config");
const { sendPasswordResetOTPEmail } = require("../src/services/emailHandlers/HandleEmail");
const { compressImage } = require("../src/services/fileModificationHandlers/HandleCompression");
const Portfolio = require("../src/models/Content/Portfolio/PortfolioModel");

async function withServer(app, run) {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  }
}

describe("Security dependency upgrade compatibility", () => {
  test("Express still parses nested query parameters and URL-encoded forms", async () => {
    const app = express();
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.post("/form", (req, res) => res.json({ query: req.query, body: req.body }));
    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/form?filter[category]=commerce`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "customer[name]=Netro&items[]=one&items[]=two",
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        query: { filter: { category: "commerce" } },
        body: { customer: { name: "Netro" }, items: ["one", "two"] },
      });
    });
  });

  test("the patched query parser rejects prototype pollution keys", async () => {
    const app = express();
    app.get("/query", (req, res) => res.json(req.query));
    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/query?__proto__[polluted]=yes&safe=value`);
      expect(await response.json()).toEqual({ safe: "value" });
      expect({}.polluted).toBeUndefined();
    });
  });

  test("configured Multer accepts the existing single and multiple upload fields", async () => {
    const app = express();
    initializeMulter(app);
    app.post("/upload", (req, res) => res.json({
      single: req.files.single[0].originalname,
      multiple: req.files.multiple.map((file) => file.originalname),
      title: req.body.title,
    }));
    const names = [1, 2, 3].map(() => `security-test-${randomUUID()}.txt`);
    try {
      await withServer(app, async (baseUrl) => {
        const form = new FormData();
        form.append("title", "Upload compatibility");
        form.append("single", new Blob(["single file"]), names[0]);
        form.append("multiple", new Blob(["first file"]), names[1]);
        form.append("multiple", new Blob(["second file"]), names[2]);
        const response = await fetch(`${baseUrl}/upload`, { method: "POST", body: form });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
          single: names[0], multiple: names.slice(1), title: "Upload compatibility",
        });
        expect(await fs.readFile(path.join("uploads", names[0]), "utf8")).toBe("single file");
      });
    } finally {
      await Promise.all(names.map((name) => fs.rm(path.join("uploads", name), { force: true })));
    }
  });

  test("configured Multer returns a controlled error for an unexpected file field", async () => {
    const app = express();
    initializeMulter(app);
    app.post("/upload", (req, res) => res.sendStatus(200));
    await withServer(app, async (baseUrl) => {
      const form = new FormData();
      form.append("unexpected", new Blob(["file"]), "unexpected.txt");
      const response = await fetch(`${baseUrl}/upload`, { method: "POST", body: form });
      expect(response.status).toBe(400);
      expect((await response.json()).message).toMatch(/File upload error/);
    });
  });

  test("the password reset email helper composes its existing template", async () => {
    const sendMail = jest.spyOn(nodemailerTransporter, "sendMail");
    const oldName = process.env.SENDER_EMAIL_NAME;
    const oldId = process.env.SENDER_EMAIL_ID;
    process.env.SENDER_EMAIL_NAME = "Netro Systems";
    process.env.SENDER_EMAIL_ID = "sender@example.com";
    try {
      const result = await sendPasswordResetOTPEmail({ email: "recipient@example.com", code: "123456" });
      const info = await sendMail.mock.results[0].value;
      expect(result).toBe(info.messageId);
      expect(info.envelope.to).toEqual(["recipient@example.com"]);
      expect(info.message.toString()).toContain("Subject: Reset Your Password");
      expect(info.message.toString()).toContain("123456");
      expect(info.message.toString()).not.toContain("{{code}}");
    } finally {
      sendMail.mockRestore();
      if (oldName === undefined) delete process.env.SENDER_EMAIL_NAME;
      else process.env.SENDER_EMAIL_NAME = oldName;
      if (oldId === undefined) delete process.env.SENDER_EMAIL_ID;
      else process.env.SENDER_EMAIL_ID = oldId;
    }
  });

  test("the compression helper produces a valid image with the upgraded native Sharp", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "netro-sharp-test-"));
    const file = path.join(dir, "image.png");
    try {
      await sharp(Buffer.alloc(400 * 400 * 3, 128), {
        raw: { width: 400, height: 400, channels: 3 },
      }).png({ compressionLevel: 0 }).toFile(file);
      expect((await fs.stat(file)).size).toBeGreaterThan(200 * 1024);
      expect(await compressImage(file)).toBe(file);
      const metadata = await sharp(file).metadata();
      expect(metadata.format).toBe("png");
      expect(metadata.width).toBe(400);
      expect(metadata.height).toBe(400);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  test("Mongoose loads the portfolio schema and casts existing query fields", () => {
    const id = new mongoose.Types.ObjectId();
    const query = Portfolio.find({ _id: id.toString(), published: "true" });
    query.cast(Portfolio);
    expect(query.getFilter()._id).toEqual(id);
    expect(query.getFilter().published).toBe(true);
    const invalidQuery = Portfolio.find({ _id: "invalid-id" });
    expect(() => invalidQuery.cast(Portfolio)).toThrow(mongoose.Error.CastError);
  });
});
