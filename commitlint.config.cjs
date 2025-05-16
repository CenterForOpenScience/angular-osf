module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation update
        'style', // Code style (formatting, missing semicolons, etc.)
        'refactor', // Code refactoring (no feature changes)
        'perf', // Performance improvements
        'test', // Adding tests
        'chore', // Build process, CI/CD, dependencies
        'revert', // Reverting changes
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
