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

### First steps

- Install git commit template: [Commit Template](docs/commit.template.md).
- [Volta](#volta)
- 3rd-party tokens [Configuration](#configuration)

### Recommended

- [Compodoc Conventions](docs/compodoc.md).
- [Docker Commands](docs/docker.md).
- [ESLint Strategy](docs/eslint.md).
- [Git Conventions](docs/git-convention.md).
- [i18n](docs/i18n.md).
- [NGXS Conventions](docs/ngxs.md).
- [Testing Strategy](docs/testing.md).

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
Install Volta from [volta](https://volta.sh/) and it will automatically pin Node/npm per the repo toolchain.

## Configuration

OSF uses an `assets/config/config.json` file for any 3rd-party tokens. This file is not committed to the repo.

There is a `assets/config/template.json` file that can be copied to `assets/config/config.json` to store any 3rd-party tokens locally.
