# Angular Documentation with Compodoc

## Index

- [Overview](#overview)
- [How to Generate Documentation](#how-to-generate-documentation)
- [Documentation Coverage Requirements](#documentation-coverage-requirements)
- [Pre-commit Enforcement via Husky](#pre-commit-enforcement-via-husky)
- [CI/CD Enforcement](#cicd-enforcement)
- [Tips for Passing Coverage](#tips-for-passing-coverage)
- [Output Directory](#output-directory)
- [Need Help?](#need-help)

---

## Overview

This project uses [Compodoc](https://compodoc.app/) to generate and enforce documentation for all Angular code. Documentation is mandatory and must meet a **100% coverage threshold** to ensure consistent API clarity across the codebase.

---

## How to Generate Documentation

To generate and view the documentation locally:

```bash
npm run docs
```

This will:

1. Build the Compodoc documentation.
2. Launch a local web server to view it (typically on [http://localhost:8080](http://localhost:8080)).

---

## Documentation Coverage Requirements

- **100% Compodoc coverage is required** across all services, components, models, and utilities.
- All public methods, properties, and classes must be documented using proper JSDoc style comments.
- Coverage checks are enforced **before every commit** and **during CI/CD** via GitHub Actions.

---

## Pre-commit Enforcement via Husky

Husky is configured to run a **pre-commit hook** that will:

- Run Compodoc.
- Check coverage.
- Block the commit if documentation coverage is below 100%.

If the hook fails, you’ll see output indicating which files or symbols are undocumented.

---

## CI/CD Enforcement

During pull requests and merges, GitHub Actions re-validates documentation coverage.

Any PR that does not meet the 100% documentation requirement will be blocked from merging until resolved.

---

## Tips for Passing Coverage

- Use `@Input`, `@Output`, and `@Injectable` annotations with proper descriptions.
- Document every exported interface, function, method, and variable.
- Use the `@example` tag for complex methods when helpful.
- Apply JSDoc on constructor-injected properties using `@param`.

---

## Output Directory

By default, generated documentation lives in:

```
/documentation/
```

This folder is **not committed to the repo** and is only used locally or in build pipelines.

---

## Need Help?

Run the following to see detailed CLI options:

```bash
npx compodoc --help
```

Or visit: [https://compodoc.app](https://compodoc.app)

---
