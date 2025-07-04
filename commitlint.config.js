// This is a configuration file for commitlint, which checks commit messages
// to ensure they follow a specific format. The configuration extends the conventional
// commit message format and sets specific rules for the header length and allowed types.
// For more information, see: https://commitlint.js.org/#/reference-configuration
// @ts-check
/**
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ['@commitlint/config-conventional'],
}
