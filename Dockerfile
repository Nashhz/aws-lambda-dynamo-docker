# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port for serverless-offline (default: 3000)
EXPOSE 3000

# Install serverless globally
RUN npm install -g serverless

# Command to run the serverless offline server
CMD ["serverless", "offline", "--host", "0.0.0.0"]
