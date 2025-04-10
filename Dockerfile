# Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm link @angular/cli
RUN ng build --verbose

# Dist
FROM node:22-alpine AS dist

WORKDIR /code

COPY --from=build /app/dist /code/dist

# Dev
FROM build AS dev

EXPOSE 4200

CMD ["ng", "serve"]
