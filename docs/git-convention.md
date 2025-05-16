# 📌 Git Branch Naming Convention (Aligned with Angular Guideline)

# 📖 Introduction

### To maintain a clean commit history and improve team collaboration, we follow Angular Conventional Commits in our Git branch naming. This approach makes it easy to identify change types and automate release processes.

# 🚀 Branch Naming Format

### The branch name should follow the format:

```bash
<type>/<issue-id>-<short-description>

type – type of change (inspired by Angular Commit Message Convention).

issue-id – task or issue ID (optional but recommended).

short-description – a brief description of the change.

```

# 📌 Available Types (type)

### We use the following types to categorize changes:

```bash
| Type --- Purpose
| feat --- Adding a new feature
| fix  --- Fixing a bug or issue
| refactor --- Code refactoring without changing functionality
| perf --- Performance improvements
| test --- Adding or updating tests
| chore --- Updating configurations, tools, or dependencies
| docs --- Updating or adding documentation
| style --- Code style changes (formatting, indentation, comments)
| ci --- Changes in CI/CD pipeline
| build --- Updates in build process or dependencies
| revert --- Reverting previous changes
```

# 📝 Branch Naming Examples

### Here are some examples of branch names:

```bash
* feat/1234-add-user-authentication
* fix/5678-fix-login-bug
* refactor/4321-optimize-api-calls
* docs/7890-update-readme
* test/8765-add-e2e-tests-for-dashboard

```

# 🛠 Example of Creating a Branch:

### To create a new branch, use the following command:

```bash
git checkout -b feat/1234-add-user-authentication

```

# 🏆 Best Practices

- ✅ Use short and clear descriptions in branch names.
- ✅ Follow a consistent style across all branches for better project structure.
- ✅ Avoid redundant words, e.g., fix/1234-fix-bug (the word "fix" is redundant).
- ✅ Use kebab-case (- instead of \_ or CamelCase).
- ✅ If there is no issue ID, omit it, e.g., docs/update-contributing-guide.

# 🔗 Additional Resources

**Conventional Commits**: https://www.conventionalcommits.org

**Angular Commit Guidelines**: https://github.com/angular/angular/blob/main/CONTRIBUTING.md

**Git Flow**: https://nvie.com/posts/a-successful-git-branching-model/

# This branch naming strategy ensures better traceability and improves commit history readability. 🚀

# 📝 Commit Message Formatting

To ensure clear and structured commit messages, we follow the Conventional Commit format:

🔹 **Commit Message Structure**

```bash
<type>(<scope>): <short description>

[optional body]

[optional footer]

type – The type of change (e.g., feat, fix, docs, style, etc.).

scope – A short context describing the part of the project affected (optional but recommended).

short description – A concise summary of the change (in imperative form, e.g., "fix login bug").

body – A more detailed explanation of the change (if necessary).

footer – Additional metadata, e.g., references to issues (Closes #123).
```

# 📌 Example Commit Messages

```bash

feat(auth): add user authentication flow

Implemented login, registration, and session handling.
Closes #1234.

fix(ui): resolve button alignment issue

Fixed misalignment of buttons in the settings panel.

docs(readme): update installation instructions

Clarified step-by-step setup instructions for the project.

```

# 🔗 Additional Resources

Conventional Commits: https://www.conventionalcommits.org

Angular Commit Guidelines: https://github.com/angular/angular/blob/main/CONTRIBUTING.md

Git Flow: https://nvie.com/posts/a-successful-git-branching-model/

This branch naming and commit message strategy ensures better traceability and improves commit history readability. 🚀
