const { setup: setupDevServer } = require('jest-dev-server')
const { setup: setupPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function globalSetup (globalConfig) {
  await setupPuppeteer(globalConfig)
  // Wait for storybook server to be ready
  await setupDevServer({
    command: `npm run storybook`,
    launchTimeout: 50000,
    protocol: 'http',
    port: 6006,
    waitOnScheme: {
      resources: ['http://localhost:6006/iframe.html'],
    }
  })
}
