
# Use Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files to the working directory
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]

