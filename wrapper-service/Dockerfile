FROM node:20

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript (dist folder)
RUN npm run build

# Expose port for wrapper API
EXPOSE 3000

# Start wrapper
CMD ["node", "dist/index.js"]
