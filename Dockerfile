FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

ENV NODE_ENV development

# Install dependencies
RUN npm install --include=dev 

# Copy the rest of the app
COPY . .

# Expose the port that the application listens on.
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
