# Open Science Framework Angular Project

This is the front-end angular repository for the Open Science Framework (OSF).

## Quickstart (Docker)

```bash
docker compose up -d --build
# open http://localhost:4200
```

**note** Depending on local system architecture the build and launch of the angular server can
take up to 60 seconds once the docker build finishes.

## Index

### Recommended

- Install git commit template: [Commit Template](docs/commit.template.md).

### Optional

- Admin Knowledge Base: [Admin Knowledge Base](docs/admin.knowledge-base.md).

## Testing the project

The project uses jest for unit testing.
A "counter" script executes before and after each test run to track how many times the unit
tests are run locally. The output is displayed.

```bash
npm run test (single test run)
npm run test:watch (single run after file save)
npm run test:coverage (code coverage results)
```

- all commits must pass the local pipeline for test coverage

```bash
npm run test:check-coverage-thresholds
```

- Verifies newly added tests match the thresholds
- This is only used until we hit 100% test coverage
- all commits must pass the local pipeline for test coverage

## Volta

OSF uses volta to manage node and npm versions inside of the repository
Install Volta from https://volta.sh/ and it will automatically pin Node/npm per the repo toolchain.

## Docker

The OSF angular project uses a docker image to simplify that developer process.

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

### Docker Commands

#### build + run in background (build is only required for the initial install or npm updates)

```bash
docker compose up -d --build
```

#### run in background

```bash
docker compose up -d
```

#### stop the container

```bash
docker compose stop
```

#### stop & remove the container(s)

```bash
docker compose down -v
```

#### Verify the image is running

```bash
docker compose ps
```

#### Stream the web logs after viewing the last 200

```bash
docker compose logs -f web --tail=200
```

```md
(`--tail=200` shows the last 200 lines first, `-f` follows new output.)
```

#### get a shell in the container if needed

```bash
docker exec -it angular-dev sh
```

#### List all Docker images

```bash
docker images
```

#### Remove a specific image by IMAGE ID

```bash
docker rmi <IMAGE_ID>
```

#### Remove a specific image by name:tag

```bash
docker rmi <image_name>:<tag>
```

#### Force remove (if image is in use)

```bash
docker rmi -f <IMAGE_ID>
```

#### Troubleshooting

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

## rollup issues and 2 package-lock.json file.

Due to a Rollup build quirk, the Docker image generates its own package-lock.json that may differ from the host version. We keep both the host and Docker-generated lock files to ensure consistent installs in each environment and to avoid dependency mismatches during builds.

The files are:

- package-lock.json - used for local development
- package-lock.docker.json - used for docker

### How to copy the lock file out of the image

1. **Build the image** (this will create the lock file inside it):

   ```sh
   docker build -t osf-angular-dev .
   ```

2. **Create a container from it** (don’t start it):

   ```sh
   docker create --name temp-angular osf-angular-dev
   ```

3. **Copy the file from the container to your host**:

   ```sh
   docker cp temp-angular:/app/package-lock.json ./package-lock.docker.json
   ```

4. **Remove the container**:
   ```sh
   docker rm temp-angular
   ```

## Commitlint

OSF uses [Commitlint](https://www.npmjs.com/package/commitlint) to **enforce a consistent commit message format**.  
This helps ensure that every commit clearly communicates its purpose, makes the Git history easier to read, and supports automated release notes.

Commitlint is configured to follow the **[Conventional Commits](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)** specification.  
Before committing changes, please review the [config-conventional README](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/README.md) for the complete standard.

---

### **Commit Message Structure**

Commit messages must be structured as:

```
<type>[scope]: <description>

[optional body]

[optional footer(s)]
```

- **`type`** → Describes the category of change (**required**).
- **`scope`** → Indicates the section of the codebase affected (**recommended**).
- **`description`** → A concise summary of the change (**required**, lowercase, no period at the end).
- **`body`** → More detailed explanation of the change (**optional**).
- **`footer`** → Metadata such as breaking change notices or issue references (**optional**).

---

### **Allowed Commit Types**

| Type         | Description                                                                           |
| ------------ | ------------------------------------------------------------------------------------- |
| **feat**     | New feature added to the codebase.                                                    |
| **fix**      | Bug fix for an existing issue.                                                        |
| **docs**     | Documentation-only changes (e.g., README, comments).                                  |
| **style**    | Changes that do not affect code meaning (formatting, whitespace, missing semicolons). |
| **refactor** | Code restructuring without changing external behavior.                                |
| **perf**     | Code changes that improve performance.                                                |
| **test**     | Adding or updating tests.                                                             |
| **chore**    | Changes to the build process, CI/CD pipeline, or dependencies.                        |
| **revert**   | Reverts a previous commit.                                                            |

---

### **Examples**

✅ **Good Examples**

```
feat(auth): add OAuth2 login support
fix(user-profile): resolve avatar upload failure on Safari
docs(readme): add setup instructions for Windows
style(header): reformat nav menu CSS
refactor(api): simplify data fetching logic
perf(search): reduce API response time by caching results
test(auth): add tests for password reset flow
chore(deps): update Angular to v19
revert: revert “feat(auth): add OAuth2 login support”
```

❌ **Bad Examples**

```
fixed bug in login
added feature
update stuff
```

---

### **Helpful Hints**

- Keep descriptions short (**under 100 characters**) and clear.
- Use imperative mood (“add feature” not “added feature”).
- Use scopes to make history easier to navigate (`feat(auth): ...`, `fix(api): ...`).
- For **breaking changes**, include a footer:
  ```
  BREAKING CHANGE: description of the change and migration instructions
  ```
- Link related issues in the footer using:
  ```
  Closes #123
  Refs #456
  ```

---

Commitlint will run automatically and reject non-compliant messages.

## GitHub pipeline

The `.github` folder contains the following:

1. The test run "counter" scripts
   .github/counter
2. Script needed for the deployment process
   .github/scripts
3. The GitHub action workflow scripts
   .github/workflows
4. The GitHub PR templates
   .github/pull_request_template.md

## Local pipeline

The local pipeline is managed via husky

1. The pre-commit requirements are:
   - linting on the staged files passes
   - .husky/pre-commit
2. The pre-push requirements are:
   - All tests pass
   - Test coverage is met
