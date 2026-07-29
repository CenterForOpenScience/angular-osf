// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

const pluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const pluginUnusedImports = require('eslint-plugin-unused-imports');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
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
      '@angular-eslint/prefer-signals': [
        'error',
        {
          preferQuerySignals: true,
          preferReadonlySignalProperties: false,
        },
      ],
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      'no-duplicate-imports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // NGXS packages
            ['^@ngxs'],

            // NGX packages (ngx-... or @ngx/...)
            ['^ngx-', '^@ngx', '^ng-'],

            // Third-party packages (primeng)
            ['^@primeng', '^primeng', '^@primeuix', '^primeuix'],

            // RxJS packages (rxjs or @rxjs/...)
            ['^rxjs', '^rxjs/operators'],

            // Vitest (vitest or @vitest/...)
            ['^vitest$'],

            // Angular packages
            ['^@angular'],

            // Internal aliases (customize as needed)
            ['^@core/', '^@osf/', '^@shared/'],

            // Testing utilities and mocks
            ['^@testing/'],

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
    files: ['src/app/**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
      eslintPluginPrettierRecommended,
    ],
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',

      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/mouse-events-have-key-events': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/role-has-required-aria': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/valid-aria': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', 'src/testing/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  }
);
