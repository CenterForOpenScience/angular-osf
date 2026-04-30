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

- [Docker Commands](docs/docker.md).
- [ESLint Strategy](docs/eslint.md).
- [Git Conventions](docs/git-convention.md).
- [i18n](docs/i18n.md).
- [NGXS Conventions](docs/ngxs.md).
- [Testing Strategy](docs/testing.md).

### Optional

- Admin Knowledge Base: [Admin Knowledge Base](docs/admin.knowledge-base.md).

## Testing the project

The project uses Vitest through Angular's unit test builder (`ng test`).
A "counter" script displays local run stats after coverage runs.

```bash
npm run test               # single test run (no watch)
npm run test:one "src/path/to/file.spec.ts"  # run one spec file
npm run test:watch         # watch mode
npm run test:coverage      # coverage reports
```

Coverage thresholds are configured in `vitest.config.ts` (`test.coverage.thresholds`).
To validate threshold updates after improving coverage:

```bash
npm run test:check-coverage-thresholds
```

## Volta

OSF uses volta to manage node and npm versions inside of the repository
Install Volta from [volta](https://volta.sh/) and it will automatically pin Node/npm per the repo toolchain.

## Configuration

OSF uses an `assets/config/config.json` file for any 3rd-party tokens. This file is not committed to the repo.

There is a `assets/config/template.json` file that can be copied to `assets/config/config.json` to store any 3rd-party tokens locally.
