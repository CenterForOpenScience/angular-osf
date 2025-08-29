module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore', // Build process, CI/CD, dependencies
        'docs', // Documentation update
        'feat', // New feature
        'fix', // Bug fix
        'lang', // All updates related to i18n changes
        'perf', // Performance improvements
        'refactor', // Code refactoring (no feature changes)
        'revert', // Reverting changes
        'style', // Code style (formatting, missing semicolons, etc.)
        'test', // Adding tests
      ],
    ],
    'scope-empty': [2, 'never'], // Scope must always be present
    'subject-case': [
      2,
      'always',
      ['sentence-case', 'start-case', 'lower-case'], // Enforce casing
    ],
    'subject-empty': [2, 'never'], // Prevent empty subjects
    'header-max-length': [2, 'always', 100], // Max length of the commit message header
    'body-leading-blank': [2, 'always'], // Enforce blank line before the body
    'footer-leading-blank': [2, 'always'], // Enforce blank line before footer
    'body-max-line-length': [2, 'always', 200], // Set max length for body lines
  },
};
