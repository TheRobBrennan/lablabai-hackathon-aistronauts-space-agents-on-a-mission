FROM node:20.11.1-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm install

# Copy local code to the container
COPY . .

# Next.js collects anonymous telemetry data about general usage - disable it
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app
RUN npm run build

# Start the application
CMD ["npm", "run", "dev"] 