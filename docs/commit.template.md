## 📝 Enabling the Shared Commit Template

This project includes a Git commit message template stored at:

```
.github/templates/commit-template.txt
```

Using a shared template helps us keep commit messages consistent and easy to read.

---

### 1. Set the Template for This Repository

Run the following command **inside the repository**:

```bash
git config commit.template .github/templates/commit-template.txt
```

This sets the template **only for this repo** (stored in `.git/config`), so it won’t affect your other projects.

---

### 2. Using the Template

Once configured, running:

```bash
git commit
```

or

```bash
git commit -a
```

will open your editor with the pre-filled template text.  
Fill in each section before saving and closing.

**note**

This command will by-pass the editor. The message will still need to follow the commitlint standard.

```bash
git commit -am 'message'
```

---
