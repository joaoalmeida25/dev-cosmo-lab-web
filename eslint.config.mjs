import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', '.husky/_/**', 'next-env.d.ts']),
  eslintConfigPrettier,
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-console': 'error',
      'no-empty': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/no-duplicates': 'error',
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: ['if', 'for', 'while', 'switch', 'try'] },
        { blankLine: 'always', prev: ['if', 'for', 'while', 'switch', 'try'], next: '*' },
        { blankLine: 'always', prev: ['multiline-const', 'multiline-let'], next: '*' },
      ],
    },
  },
]);

export default eslintConfig;
