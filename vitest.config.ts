import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['setup-vitest.ts'],
    environment: 'jsdom',
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['json-summary', 'lcov', 'text-summary'],
      thresholds: {
        branches: 73,
        functions: 85,
        lines: 83,
        statements: 84,
      },
    },
  },
});
