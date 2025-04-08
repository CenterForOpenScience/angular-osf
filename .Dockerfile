FROM oven/bun:latest as build

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

RUN bun run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

## docker build -t angular-bun-app .
## docker run -p 80:80 angular-bun-app

