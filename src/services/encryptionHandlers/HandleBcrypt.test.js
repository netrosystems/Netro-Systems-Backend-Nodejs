// __tests__/encryptionHandlers.test.js

const bcrypt = require("bcryptjs");
const { hashPassword, comparePasswords } = require("./HandleBcrypt");
const { logger } = require("../logHandlers/HandleWinston");

jest.mock("bcryptjs");
jest.mock("../logHandlers/HandleWinston", () => ({
  logger: {
    log: jest.fn(),
  },
}));

describe("Encryption Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should hash a password successfully", async () => {
      const password = "testpassword";
      const hashedPassword = "hashedpassword";

      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(logger.log).toHaveBeenCalledWith(
        "info",
        "Password hashed successfully"
      );
    });

    it("should return null and log an error if hashing fails", async () => {
      const errorMessage = "Hashing error";
      bcrypt.hash.mockRejectedValue(new Error(errorMessage));

      const result = await hashPassword("testpassword");

      expect(result).toBeNull();
      expect(logger.log).toHaveBeenCalledWith("error", errorMessage);
    });
  });

  describe("comparePasswords", () => {
    it("should return true for matching passwords", async () => {
      const password = "testpassword";
      const hashedPassword = "hashedpassword";

      bcrypt.compare.mockResolvedValue(true);

      const result = await comparePasswords(password, hashedPassword);

      expect(result).toBe(true);
      expect(logger.log).toHaveBeenCalledWith("info", "Password matched");
    });

    it("should return false for non-matching passwords", async () => {
      const password = "testpassword";
      const hashedPassword = "hashedpassword";

      bcrypt.compare.mockResolvedValue(false);

      const result = await comparePasswords(password, hashedPassword);

      expect(result).toBe(false);
      expect(logger.log).toHaveBeenCalledWith(
        "error",
        "Password did not match"
      );
    });

    it("should return false and log an error if comparison fails", async () => {
      const errorMessage = "Comparison error";
      bcrypt.compare.mockRejectedValue(new Error(errorMessage));

      const result = await comparePasswords("testpassword", "hashedpassword");

      expect(result).toBe(false);
      expect(logger.log).toHaveBeenCalledWith("error", errorMessage);
    });
  });
});
