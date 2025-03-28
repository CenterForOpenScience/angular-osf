
# Stage 1: Build Angular app with Bun
FROM oven/bun:latest as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the source code
COPY . .

# Build Angular app for production
RUN bun run build

# Stage 2: Serve Angular app with Nginx
FROM nginx:stable-alpine

# Copy the built Angular app to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
