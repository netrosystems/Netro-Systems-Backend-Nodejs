# Run Netro Systems Server with Docker

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/): For building and running Docker containers.

## Setup

### Clone the Repository

First, clone the repository to your local machine:

### Build the Docker Image

Build the Docker image using the provided `Dockerfile`. Replace `your-image-name` with a name you prefer for your Docker image:

```bash
docker build -t your-image-name .
```

### Create a `.env` File

Create a `.env` file in the root directory of your project to define the necessary environment variables. Here’s an example of what it might look like:

```plaintext
NODE_ENV=

SERVER_PORT=
MONGOOSE_URI=
DATABASE_NAME=

JWT_EXPIRES_IN=
JWT_SECRET_KEY=

TEMP_SESSION_EXPIRES_IN=
TEMP_SESSION_SECRET=

SENDER_EMAIL_HOSTNAME=
SENDER_EMAIL_PORT=
SENDER_EMAIL_NAME=
SENDER_EMAIL_ID=
SENDER_EMAIL_PASSWORD=

FRONTEND_BASE_URL=
```

### Run the Docker Container

Run the Docker container from the built image. Replace `your-image-name` with the name of your Docker image and `your-container-name` with a name you prefer for the container:

```bash
docker run -d -p 5000:5000 --name your-container-name --env-file .env your-image-name
```

- `-d`: Runs the container in detached mode.
- `-p 5000:5000`: Maps port 5000 on your host to port 5000 in the container.
- `--name your-container-name`: Assigns a name to the container for easier reference.
- `--env-file .env`: Loads environment variables from the `.env` file.
- `your-image-name`: The name of your Docker image.

### Access the Application

Once the container is running, you can access the application at `http://localhost:5000`.

### Stopping and Removing the Container

To stop the running container, use:

```bash
docker stop your-container-name
```

To remove the stopped container, use:

```bash
docker rm your-container-name
```

### Rebuilding the Docker Image

If you make changes to the code or `Dockerfile`, you will need to rebuild the Docker image:

```bash
docker build -t your-image-name .
```

### Troubleshooting

- **Error Connecting to MongoDB**: Ensure that your MongoDB URI in the `.env` file is correct and that the MongoDB service is running.
- **Port Conflicts**: Make sure that port 5000 is not in use by another application on your host machine.

## Contributing

If you’d like to contribute to this project, please follow the standard fork-and-pull request workflow. Ensure all contributions adhere to the coding standards and include tests where appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to adjust the content based on your specific project requirements and any additional details that might be relevant.
