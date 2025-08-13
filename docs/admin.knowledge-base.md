# Admin Knowledge Base

Information on updates that require admin permissions

## All things GitHub

### GitHub pipeline

The `.github` folder contains the following:

1. The test run "counter" scripts
   .github/counter
2. Script needed for the deployment process
   .github/scripts
3. The GitHub action workflow scripts
   .github/workflows
4. The GitHub PR templates
   .github/pull_request_template.md

### Local pipeline

The local pipeline is managed via husky

1. The pre-commit requirements are:
   - linting on the staged files passes
   - .husky/pre-commit
2. The pre-push requirements are:
   - All tests pass
   - Test coverage is met
   - .husky/pre-push

### Updating the git template message

if the shared template changes in `.github/templates/commit-template.txt`, pull the latest changes from `main` and you’ll get the updated version automatically. your local git config will still point to the same file.

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
