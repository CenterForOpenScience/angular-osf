// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const pluginImport = require('eslint-plugin-import');
const pluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const pluginUnusedImports = require('eslint-plugin-unused-imports');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const angularEslintTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'osf',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'osf',
          style: 'kebab-case',
        },
      ],
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // NGXS packages
            ['^@ngxs'],

            // NGX packages (ngx-... or @ngx/...)
            ['^ngx-', '^@ngx', '^ng-'],

            // Third-party packages (primeng)
            ['^@primeng', '^primeng'],

            // RxJS packages (rxjs or @rxjs/...)
            ['^rxjs', '^rxjs/operators'],

            // Angular packages
            ['^@angular'],

            // Internal aliases (customize as needed)
            ['^@core/', '^@osf/', '^@shared/'],

            // Side effect imports
            ['^\\u0000'],

            // Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

            // Sibling and current directory imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-console': 'error',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularEslintTemplate,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/banana-in-box': ['error'],
      '@angular-eslint/template/eqeqeq': ['error'],
      '@angular-eslint/template/no-negated-async': ['error'],
      '@angular-eslint/template/alt-text': ['error'],
      '@angular-eslint/template/click-events-have-key-events': ['error'],
      '@angular-eslint/template/elements-content': ['error'],
      '@angular-eslint/template/interactive-supports-focus': ['error'],
      '@angular-eslint/template/label-has-associated-control': ['error'],
      '@angular-eslint/template/mouse-events-have-key-events': ['error'],
      '@angular-eslint/template/no-autofocus': ['error'],
      '@angular-eslint/template/no-distracting-elements': ['error'],
      '@angular-eslint/template/role-has-required-aria': ['error'],
      '@angular-eslint/template/table-scope': ['error'],
      '@angular-eslint/template/valid-aria': ['error'],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  }
);
