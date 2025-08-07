module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: '<rootDir>/jest.global-setup.ts',
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov', 'clover'],
  moduleNameMapper: {
    '^@osf/(.*)$': '<rootDir>/src/app/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@styles/(.*)$': '<rootDir>/assets/styles/$1',
    '^src/environments/environment$': '<rootDir>/src/environments/environment.ts',
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@ngxs|@angular|@ngrx|parse5|entities|chart.js)'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'html', 'json', 'mjs'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/app/**/*.{ts,js}',
    '!src/app/**/*.spec.{ts,js}',
    '!src/app/**/*.module.ts',
    '!src/app/**/index.ts',
    '!src/app/**/public-api.ts',
  ],
  extensionsToTreatAsEsm: ['.ts'],
  coverageThreshold: {
    global: {
      branches: 11.89,
      functions: 12.12,
      lines: 37.27,
      statements: 37.83,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/src/app/features/registry/',
    '<rootDir>/src/app/features/project/',
    '<rootDir>/src/app/features/registries/',
    '<rootDir>/src/app/features/settings/',
    '<rootDir>/src/app/shared/',
  ],
};
