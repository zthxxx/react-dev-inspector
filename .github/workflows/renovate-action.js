/**
 * https://docs.renovatebot.com/self-hosted-configuration
 * https://docs.renovatebot.com/configuration-options/
 *
 * also need `"renovate": { "enabled": false }` in package.json
 */

/**
 * https://github.com/chalk/supports-color/blob/main/index.js#L21
 */
process.env.FORCE_COLOR = 'true'


module.exports = {
  repositories: [
    'zthxxx/react-dev-inspector',
  ],
  force: {
    enabled: true
  },

  onboarding: false,

  extends: [
    'config:base',
    'group:allNonMajor',
  ],

  rangeStrategy: 'bump',
  labels: ['dependencies', 'renovate'],
  rebaseWhen: 'behind-base-branch',
  branchConcurrentLimit: 4,
  prConcurrentLimit: 4,

  logLevel: 'debug',
  printConfig: true,
  onboarding: false,
}
