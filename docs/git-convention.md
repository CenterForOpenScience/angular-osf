# CommitLint and Git Branch Naming Convention (Aligned with Angular Guideline)

## Index

- [Overview](#overview)
- [Local pipeline](#local-pipeline)
- [Contributing Workflow](#contributing-workflow)
- [Commitlint](#commitlint)
- [Branch Naming Format](#branch-naming-format)

---

## Overview

To maintain a clean, structured commit history and optimize team collaboration, we adhere to the Angular Conventional Commits standard for both commit messages and Git branch naming. This ensures every change type is immediately recognizable and supports automation for changelog generation, semantic versioning, and streamlined release processes.

In addition, we enforce these standards using CommitLint, ensuring that all commit messages conform to the defined rules before they are accepted into the repository.

This project employs both GitHub Actions and a local pre-commit pipeline to validate commit messages, enforce branch naming conventions, and maintain repository integrity throughout the development workflow.

---

## Local pipeline

The local pipeline is managed via husky

1. The pre-commit requirements are:
   - linting on the staged files passes
2. The pre-push requirements are:
   - All tests pass
   - Test coverage is met

---

## Contributing Workflow

To contribute to this repository, follow these steps:

1. **Fork the Repository**

   - Go to the main repository page on GitHub [OSF Angular Project](https://github.com/CenterForOpenScience/angular-osf).
   - Click the **Fork** button (top-right corner).
   - This creates a copy of the repository under your GitHub account.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

3. **Create a Feature Branch**

   ```bash
   git checkout -b feat/my-new-feature
   ```

4. **Make Your Changes**

   - Follow the commit conventions outlined below.
   - Ensure all tests pass before committing.

5. **Push to Your Fork**

   ```bash
   git push origin feat/my-new-feature
   ```

6. **Open a Pull Request**
   - Go to the main repository page on GitHub [OSF Angular Project](https://github.com/CenterForOpenScience/angular-osf).
   - Click **New Pull Request**.
   - Select your fork and branch, then create the PR against the appropriate branch of the main repo.
     - A pre-determined `feature` branch (standard OSF development cycle)
     - The `active PB&S` branch (standard OSF bug fix cycle)
     - `develop` (used by internal OSF release engineers for releases to the testing environment)
     - `main` (used by internal OSF release engineers to push tested (QA and UAT) code to production)

---

This workflow ensures that:

- All changes are reviewed before merging.
- The main repository remains stable.
- Contributors maintain full control of their own changes until they are merged.

For a step-by-step guide on forking and creating pull requests, see [GitHub’s documentation on forks](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and [about pull requests](https://docs.github.com/en/pull-requests).

---

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
| **chore**    | Changes to the build process, CI/CD pipeline, or dependencies.                        |
| **docs**     | Documentation-only changes (e.g., README, comments).                                  |
| **feat**     | New feature added to the codebase.                                                    |
| **fix**      | Bug fix for an existing issue.                                                        |
| **lang**     | Any updates to the i18n files in src/asssets/i18n/en.json.                            |
| **perf**     | Code changes that improve performance.                                                |
| **refactor** | Code restructuring without changing external behavior.                                |
| **revert**   | Reverts a previous commit.                                                            |
| **style**    | Changes that do not affect code meaning (formatting, whitespace, missing semicolons). |
| **test**     | Adding or updating tests.                                                             |

---

### **Examples**

**Good Examples**

```
chore(deps): update Angular to v19
docs(readme): add setup instructions for Windows
feat(auth): add OAuth2 login support
fix(user-profile): resolve avatar upload failure on Safari
lang(eng-4898): added new strings for preprint page
perf(search): reduce API response time by caching results
refactor(api): simplify data fetching logic
revert: revert “feat(auth): add OAuth2 login support”
style(header): reformat nav menu CSS
test(auth): add tests for password reset flow
```

**Bad Examples**

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

Commitlint will run automatically and reject non-compliant messages.

---

## Branch Naming Format

### The branch name should follow the format:

```bash
<type>/<issue-id>-<short-description>

type – type of change (inspired by Angular Commit Message Convention).

issue-id – task or issue ID (optional but recommended).

short-description – a brief description of the change.

```

---

## Available Types (type)

See the [Allowed Commit Types](#allowed-commit-types) section for details.

---

## Branch Naming Examples

### Here are some examples of branch names:

```bash
* feat/1234-add-user-authentication
* fix/5678-fix-login-bug
* refactor/4321-optimize-api-calls
* docs/7890-update-readme
* test/8765-add-e2e-tests-for-dashboard

```

### Example of Creating a Branch:

To create a new branch, use the following command:

```bash
git checkout -b feat/1234-add-user-authentication

```

### Best Practices

- Use short and clear descriptions in branch names.
- Follow a consistent style across all branches for better project structure.
- Avoid redundant words, e.g., fix/1234-fix-bug (the word "fix" is redundant).
- Use kebab-case (- instead of \_ or CamelCase).
- If there is no issue ID, omit it, e.g., docs/update-contributing-guide.

### Additional Resources

**Conventional Commits**: https://www.conventionalcommits.org

**Angular Commit Guidelines**: https://github.com/angular/angular/blob/main/CONTRIBUTING.md

**Git Flow**: https://nvie.com/posts/a-successful-git-branching-model/

### This branch naming strategy ensures better traceability and improves commit history readability.

### Additional Resources

Conventional Commits: https://www.conventionalcommits.org

Angular Commit Guidelines: https://github.com/angular/angular/blob/main/CONTRIBUTING.md

Git Flow: https://nvie.com/posts/a-successful-git-branching-model/

This branch naming and commit message strategy ensures better traceability and improves commit history readability.
