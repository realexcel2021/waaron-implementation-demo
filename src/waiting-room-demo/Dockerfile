# Use the official Node.js image as the base image
FROM node:21-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# No need for nginx image anymore, we'll use the same node image
# Expose the port your Node.js server will use (typically 3000 or similar)
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]