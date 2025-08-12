# Open Science Framework Angular Project

This is the front-end angular repository for the Open Science Framework (OSF).

## Running the project

1. npm install
2. npm run start
3. browse to localhost:4200

## Testing the project

The project uses jest for unit testing.
A "counter" script executes before and after each test run to track how many times the unit
tests are run locally. The output is displayed.

1. npm run test (single test run)
2. npm run test:watch (single run after file save)
3. npm run test:coverage (code coverage results)
   - all commits must pass the local pipeline for test coverage
4. npm run test:check-coverage-thresholds
   - Verifies newly added tests match the thresholds
   - This is only used until we hit 100% test coverage
   - all commits must pass the local pipeline for test coverage

## Github pipeline

The `.github` folder contains the following:

1. The test run "counter" scripts
   .github/scripts
2. The "counter" file
   .github/counter
3. The github action work flow scripts
   .github/workflows
4. The github PR templates
   .github/pull_request_template.md

## Local pipeline

The local pipeline pipeline is managed via husky

1. The pre-commit requirements are:
   - linting on the staged files passes
   - .husky/pre-commit
2. The pre-push requirements are:
   - All tests pass
   - Test coverage is met

## Volta

OSF uses volta (https://volta.sh/) to manage node and npm versions inside of the repository

## Commitlint

OSF use commitlint (https://www.npmjs.com/package/commitlint) to standardize the commit messages.
Please review the commitlint conventions (@commitlint/config-conventional/README.md)
