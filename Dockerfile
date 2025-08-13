# Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm link @angular/cli
RUN ng build --verbose

# Dist
FROM node:22-alpine AS dist

WORKDIR /code

COPY --from=build /app/dist /code/dist

# Dev - run only
FROM build AS dev

EXPOSE 4200

CMD ["ng", "serve"]

# Local Development - coding
FROM node:22-alpine AS local-dev
WORKDIR /app

# Install deps in the image (kept in container)
COPY package*.json ./
# COPY package-lock.docker.json ./package-lock.json
RUN npm ci --no-audit --no-fund

# Expose Angular dev server
EXPOSE 4200
