import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
    server: { deps: { inline: [/next-intl/] } },
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      thresholds: Object.fromEntries(
        ['hook', 'service', 'mapper', 'util', 'repository'].map((unit) => [
          `src/**/*.${unit}.ts`,
          { perFile: true, statements: 100, branches: 100, functions: 100, lines: 100 },
        ]),
      ),
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.spec.{ts,tsx}', 'src/**/*.types.ts', 'src/**/*.constants.ts'],
      reporter: ['text', 'html', 'json', 'json-summary'],
      reportOnFailure: true,
    },
  },
});
