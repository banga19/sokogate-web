/**
 * Checkly — Uptime & Browser Monitoring Configuration
 *
 * https://www.checklyhq.com/docs/cli/
 *
 * Usage:
 *   npx checkly test    # Run checks locally
 *   npx checkly deploy  # Deploy to Checkly cloud
 */

const { defineConfig } = require('@checkly/cli');

module.exports = defineConfig({
  projectName: 'Sokogate Web',
  logicalId: 'sokogate-web',
  repoUrl: 'https://github.com/banga19/sokogate-web',
  checks: {
    activated: true,
    muted: false,
    runtimeId: '2024.02',
    frequency: 5, // minutes
    locations: [
      'us-east-1',
      'eu-west-1',
      'ap-southeast-1',
      'ap-northeast-1',
    ],
    tags: ['production'],
    alertSettings: {
      escalationType: 'RUN_BASED',
      runBasedEscalation: {
        failedRunThreshold: 2,
      },
      timeBasedEscalation: {
        minutesFailingThreshold: 10,
      },
    },
  },
  playwrightConfig: {
    use: {
      baseURL: process.env.ENVIRONMENT_URL || 'https://sokogate.com',
      ignoreHTTPSErrors: false,
      extraHTTPHeaders: {
        'x-monitor-check': 'true',
      },
    },
  },
  browserChecks: {
    frequency: 10, // minutes
    locations: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
  },
});
