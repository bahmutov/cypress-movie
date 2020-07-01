// @ts-check
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const CDP = require('chrome-remote-interface')
const debug = require('debug')('cypress-movie')
const path = require('path')
const fs = require('fs').promises
const _ = require('lodash')
const { runInNewContext } = require('vm')

/**
 * Warning: modifies the input array
 * @param {string[]} args Chrome browser launch CLI arguments
 * @example
 *  on('before:browser:launch', (browser = {}, launchOptions) => {
 *    const port = ensureRdpPort(launchOptions.args)
 *    return launchOptions
 *  })
 */
function ensureRdpPort(args) {
  const existing = args.find(
    (arg) => arg.slice(0, 23) === '--remote-debugging-port',
  )

  if (existing) {
    return Number(existing.split('=')[1])
  }

  const port = 40000 + Math.round(Math.random() * 25000)

  args.push(`--remote-debugging-port=${port}`)

  return port
}

let port = 0
let client = null

const size = (x) => {
  console.log(x)
  return null
}

// see _screenshotTask
// in https://github.com/puppeteer/puppeteer/blob/main/src/common/Page.ts
const initTakingScreenshot = (width = 1920, height = 1080) => async (
  options = {},
) => {
  debug('taking screenshot')
  debug('options %o, %o', { width, height }, options)

  debug('await client on port %d', port)
  client = client || (await CDP({ port }))

  const device = {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
    fitWindow: false,
  }

  // set viewport and visible size
  await client.send('Emulation.setDeviceMetricsOverride', device)
  await client.send('Emulation.setVisibleSize', { width, height })

  const result = await client.send('Page.captureScreenshot', {
    format: 'png',
  })
  debug('took screenshot')
  const decoded = Buffer.from(result.data, 'base64')
  debug('joining folder', options.screenshotFolder)

  const outputFolder = path.join(options.screenshotFolder, options.spec.name)
  const screenshotFilename = path.join(outputFolder, options.name + '.png')
  debug('saving %s', screenshotFilename)
  await fs.mkdir(outputFolder, { recursive: true })
  await fs.writeFile(screenshotFilename, decoded)
  debug('saved %s', screenshotFilename)

  return screenshotFilename
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const pluginOptions = _.get(config, 'env.cypress-movie', {})
  _.defaults(pluginOptions, {
    enabled: true,
    width: 1920,
    height: 1080,
  })
  console.log('cypress-movie options %o', pluginOptions)
  if (!pluginOptions.enabled) {
    return
  }

  const takeScreenshot = initTakingScreenshot(
    pluginOptions.width,
    pluginOptions.height,
  )
  on('task', {
    size,
    takeScreenshot,
  })

  on('before:browser:launch', (browser = {}, launchOptions) => {
    debug('browser name: %s', browser.name)
    client = null

    if (browser.name === 'electron' && browser.isHeadless) {
      launchOptions.preferences['width'] = pluginOptions.width
      launchOptions.preferences['height'] = pluginOptions.height
      launchOptions.preferences['resizable'] = false
      return launchOptions
    }
    if (['chrome', 'chromium'].includes(browser.name) && browser.isHeadless) {
      // TODO replace existing argument if found
      // we should check if there is already an argument "--window-size"
      // and if it is found, replace it
      launchOptions.args.push(
        `--window-size=${pluginOptions.width},${pluginOptions.height}`,
      )
      // movies and screenshots look better without scrollbars
      launchOptions.args.push('--hide-scrollbars')

      port = ensureRdpPort(launchOptions.args)
      console.log(
        'ensureRdpPort %d resolution %dx%d',
        port,
        pluginOptions.width,
        pluginOptions.height,
      )
      debug('Chrome arguments %o', launchOptions.args)
      return launchOptions
    }
  })

  config.viewportWidth = pluginOptions.width
  config.viewportHeight = pluginOptions.height
  return config
}
