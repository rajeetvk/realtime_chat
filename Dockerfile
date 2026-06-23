
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
# This takes advantage of Docker's layer caching mechanism
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (matches the PORT in your code/env)
EXPOSE 9000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
