import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 20000,
    globals: true,
    include: ['src/**/*.test.(ts|tsx)'],
    exclude: [
      '**/node_modules/**',
      '**/templates/**',
      '**/coverage/**',
      '**/dist/**',
      '**/lib/**',
      '**/es/**',
    ],
    coverage: {
      enabled: false,
      include: [
        '**/src/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/*.mock.ts',
        '**/mocks/**',
        '**/dist/**',
        '**/lib/**',
        '**/es/**',
      ],
    },
  },
})
