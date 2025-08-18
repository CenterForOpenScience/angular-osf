# Docker

The OSF angular project uses a docker image to simplify the developer process.

### Volumes

The container serves and rebuilds from mounted sources. The following host paths
are mounted into the container’s workdir (e.g., `/app`):

- `./public` → `/app/public`
- `./src` → `/app/src`
- `./angular.json` → `/app/angular.json`
- `./tsconfig.json` → `/app/tsconfig.json`
- `./tsconfig.app.json` → `/app/tsconfig.app.json`

**Notes:**

1. `node_modules` is installed **inside the image** during build; it is **not** mounted from the host.
2. The `start:docker` command runs the Angular CLI build and development server inside the container.  
   It requires the project’s Angular configuration files (`angular.json`, `tsconfig.json`, `tsconfig.app.json`) to be present in the container’s `/app` directory.  
   If these are missing, the container will fail to build or serve the app.

### Angular server

The angular server is run from the docker image.
localhost:4200 in any browser will display the site.
Any changes to files in the /root/src directory will force the angular server to reload

The dev server binds to `0.0.0.0` inside the container so your host can reach it on `http://localhost:4200`.  
If you don’t see the site, ensure the start script includes:

```json
"start": "ng serve --host 0.0.0.0 --port 4200 --poll 2000"
```

## Docker Commands

### build + run in background (build is only required for the initial install or npm updates)

```bash
docker compose up -d --build
```

### run in background

```bash
docker compose up -d
```

### stop the container

```bash
docker compose stop
```

### stop & remove the container(s)

```bash
docker compose down -v
```

### Verify the image is running

```bash
docker compose ps
```

### Stream the web logs after viewing the last 200

```bash
docker compose logs -f web --tail=200
```

```md
(`--tail=200` shows the last 200 lines first, `-f` follows new output.)
```

### get a shell in the container if needed

```bash
docker exec -it angular-dev sh
```

### List all Docker images

```bash
docker images
```

### Remove a specific image by IMAGE ID

```bash
docker rmi <IMAGE_ID>
```

### Remove a specific image by name:tag

```bash
docker rmi <image_name>:<tag>
```

### Force remove (if image is in use)

```bash
docker rmi -f <IMAGE_ID>
```

## Troubleshooting

If the application does not open in your browser at [http://localhost:4200](http://localhost:4200), follow these steps in order:

1. **Check if the container is running**

   ```bash
   docker compose ps
   ```

   Look for the `web` container and verify its status is `Up`.

2. **Rebuild and recreate the container**  
   If the container is not running, has exited, or the image is outdated:

   ```bash
   docker compose up --build -d
   ```

3. **View container logs for errors**

   ```bash
   docker compose logs web
   ```

4. **Test if the service responds locally**

   ```bash
   curl http://localhost:4200
   ```

   You should see HTML output from the Angular app.

5. **Verify that port 4200 is bound**

   ```bash
   docker compose port web 4200
   ```

   This should return something like `0.0.0.0:4200` or `127.0.0.1:4200`.

6. **Bypass browser caching issues**

   - Open the site in an incognito/private window.
   - Or test with:
     ```bash
     curl -I http://localhost:4200
     ```

7. **Check network configuration**  
   Ensure the web container is connected to the correct network:

   ```bash
   docker network ls
   docker network inspect <network_name>
   ```

8. **Inspect live Angular CLI logs**  
   If Angular is not serving content, run:

   ```bash
   docker compose exec web npm run start:docker -- --verbose
   ```

9. **If all else fails – reset and rebuild everything**
   ```bash
   docker compose down --volumes --remove-orphans
   docker compose up --build -d
   ```
