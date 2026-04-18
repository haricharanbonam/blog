# Use base image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of code
COPY . .

# Expose port
EXPOSE 3000

# Start appz
CMD ["npm", "run", "dev"]