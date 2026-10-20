import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Весь текст интерфейса только из словарей (docs/SPEC.md, раздел 1, п. 4)
    files: ['src/components/**/*.tsx', 'src/blocks/**/*.tsx', 'src/app/(frontend)/**/*.tsx'],
    rules: {
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: ['·', '—', '–', '/', '×', '%', '+', '−', ':', '(', ')', '→', '←', '★', '|', ',', '.', '*'],
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/payload-types.ts',
    'src/app/(payload)/**',
    'src/migrations/**',
    '.data/**',
    'media/**',
    'private-files/**',
    'playwright-report/**',
    'test-results/**',
  ]),
])

export default eslintConfig
