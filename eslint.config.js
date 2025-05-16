// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const pluginImport = require('eslint-plugin-import');
const pluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const pluginUnusedImports = require('eslint-plugin-unused-imports');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

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
      '@typescript-eslint/no-unused-vars': 'warn',
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
      'import/no-duplicates': 'warn',
      'import/newline-after-import': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // NGXS packages
            ['^@ngxs'],

            // NGX packages (ngx-... or @ngx/...)
            ['^ngx-', '^@ngx', '^ng-'],

            // Third-party packages (primeng)
            ['^primeng'],

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
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  }
);
