# Linting Strategy – OSF Angular

## Index

- [Overview](#overview)
- [Linting Commands](#linting-commands)
- [ESLint Config Structure](#eslint-config-structure)
- [Pre-Commit Hook](#pre-commit-hook)
- [Summary](#summary)

---

## Overview

This project uses a **unified, modern ESLint flat config** approach to enforce consistent coding styles, accessibility standards, and TypeScript best practices. Linting runs on:

- TypeScript (`*.ts`)
- HTML templates (`*.html`)
- Specs (`*.spec.ts`)

It also integrates into the **Git workflow** via `pre-commit` hooks to ensure clean, compliant code before every commit.

**IMPORTANT**
The OSF application must meet full accessibility (a11y) compliance to ensure equitable access for users of all abilities, in alignment with our commitment to inclusivity and funding obligations.

---

## Linting Commands

```bash
# Run full project lint
npm run lint
```

---

## ESLint Config Structure

### 1. TypeScript Files (`**/*.ts`)

**Extends**:

- `@eslint/js` → base ESLint config
- `typescript-eslint` recommended & stylistic configs
- `angular-eslint` TypeScript rules
- `eslint-plugin-prettier/recommended`

**Plugins**:

- `eslint-plugin-import`
- `eslint-plugin-simple-import-sort`
- `eslint-plugin-unused-imports`

**Key Rules**:

- Enforces Angular selector styles:
  - Directives → `osfFoo` (camelCase)
  - Components → `<osf-bar>` (kebab-case)
- Enforces import sorting and duplicate prevention
- Removes unused imports automatically
- Allows unused variables named `_` to support convention (e.g., destructuring)

---

### 2. HTML Templates (`**/*.html`)

**Extends**:

- `angular-eslint/templateRecommended`
- `angular-eslint/templateAccessibility`

**Parser**:

- `@angular-eslint/template-parser`

**Key A11y Rules** (All Set to `"error"`):

- `alt-text`
- `valid-aria`
- `click-events-have-key-events`
- `role-has-required-aria`
- `interactive-supports-focus`
- `no-distracting-elements`
- `no-autofocus`
- `label-has-associated-control`

> This enforces **WCAG accessibility compliance** directly in Angular templates.

---

### 3. Test Files (`**/*.spec.ts`)

Loosened restrictions for developer convenience:

```ts
'@typescript-eslint/no-explicit-any': 'off',
'@typescript-eslint/no-empty-function': 'off',
```

---

## Pre-Commit Hook

The `pre-commit` file includes:

- `npx lint-staged` → Lint only **staged files** before every commit
- Ensures **TypeScript and template linting** run automatically

## Summary

| File Type    | Purpose                               | Key Rules                               |
| ------------ | ------------------------------------- | --------------------------------------- |
| `*.ts`       | Lint Angular + TS logic               | Unused imports, selector rules, sorting |
| `*.html`     | Enforce a11y & Angular best practices | All template a11y rules enforced        |
| `*.spec.ts`  | Relaxed for test convenience          | Some TS rules turned off                |
| `pre-commit` | Git hook to lint before committing    | Ensures consistent PR quality           |
