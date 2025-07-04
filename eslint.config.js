import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/**
 * List of files that must be ignored globally
 */
export const GLOBAL_IGNORE_LIST = [
  '.github/',
  '.husky/',
  '.vscode/',
  'node_modules',
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
    files: ['**/*.ts', '**/*.js'],
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
    files: ['tests/**/*.ts', 'bin/*.ts', 'scripts/*.js'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin, // Enable Node.js globals for these files
      },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.browser).filter(
          // Disallow browser-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.nodeBuiltin, g)
        ),
      ],
    },
  },
  {
    files: ['examples/**/*.ts', 'examples/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin, // Enable Node.js globals for these files
      },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.browser).filter(
          // Disallow browser-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.nodeBuiltin, g)
        ),
      ],
      'max-len': 'off',
      'no-console': 'off',
    },
  },
  {
    ignores: GLOBAL_IGNORE_LIST,
  },
]
