# Admin Knowledge Base

## Index

- [Overview](#overview)
- [All things GitHub](#all-things-github)

---

## Overview

Information on updates that require admin permissions

---

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
5. The backup json for the settings/rules
   .github/rules

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
