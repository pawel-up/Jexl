import { defineConfig } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pluginJs from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

/**
 * List of files that must be ignored globally
 */
export const GLOBAL_IGNORE_LIST = [
  '.github/',
  '.husky/',
  '.vscode/',
  '.wireit/',
  'coverage/',
  'node_modules',
  'eslint.config.js',
  '*.min.*',
  '*.d.ts',
  'CHANGELOG.md',
  'lib/**',
  'LICENSE*',
  'coverage/**',
  'package-lock.json',
]

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      sourceType: 'module',
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.node).filter(
          // Disallow Node-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.browser, g)
        ),
      ],
      'max-len': [
        'error',
        {
          code: 120,
          comments: 120,
          ignoreUrls: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'no-unreachable': ['error'],
      'no-multi-spaces': ['error'],
      'no-console': ['error'],
      'no-redeclare': ['error'],
    },
  },
  {
    ignores: GLOBAL_IGNORE_LIST,
  },
]
