# Dependencies stage
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Build stage (SSR build output)
FROM deps AS build
COPY . .
RUN NG_BUILD_OPTIMIZE_CHUNKS=1 npx ng build --configuration=ssr --verbose

# SSR runtime stage
FROM build AS ssr
WORKDIR /app
RUN npm prune --omit=dev --no-audit --no-fund
EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/osf/server/server.mjs"]

# Static dist artifact stage
FROM node:22-alpine AS dist
WORKDIR /code
COPY --from=build /app/dist /code/dist

# Dev server stage
FROM deps AS dev
COPY . .
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

# Local development stage
FROM node:22-alpine AS local-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
