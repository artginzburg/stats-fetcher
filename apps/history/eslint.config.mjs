import { FlatCompat } from '@eslint/eslintrc';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * @type {import("eslint").Linter.Config}
 */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{ts,tsx,mjs}'],
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'external',
            'internal',
            'builtin',

            'parent',
            'sibling',
            'index',

            'type',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'import/newline-after-import': 'warn',
    },
  },
];

export default eslintConfig;
