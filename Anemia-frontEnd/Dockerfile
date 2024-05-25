# Use a base image with Node.js
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Vite React app files to the working directory
COPY . .

# Build the Vite React app
RUN npm run build

# Expose the port on which the Vite server will run
EXPOSE 5173

# Command to start the Vite server
CMD ["npm", "run", "preview"]