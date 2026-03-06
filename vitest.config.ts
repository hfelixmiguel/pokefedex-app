import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/__tests__/*.test.ts', 'tests/__tests__/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/__tests__/**',
        '**/*.d.ts',
      ],
    },
  },
});