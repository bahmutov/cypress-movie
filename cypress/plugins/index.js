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

/**
 * Warning: modifies the input array
 * @param {string[]} args Chrome browser launch CLI arguments
 * @example
 *  on('before:browser:launch', (browser = {}, launchOptions) => {
 *    const port = ensureRdpPort(launchOptions.args)
 *    return launchOptions
 *  })
 */
function ensureRdpPort (args) {
  const existing = args.find((arg) => arg.slice(0, 23) === '--remote-debugging-port')

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
const takeScreenshot = async (options = {}) => {
  debug('taking screenshot')
  debug('options', options)

  debug('await client on port %d', port)
  client = client || await CDP({ port })

  const result = await client.send('Page.captureScreenshot', {
    format: 'png'
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
  on('task', {
    size,
    takeScreenshot
  })

  on('before:browser:launch', (browser = {}, launchOptions) => {
    debug('browser name: %s', browser.name)
    client = null

    if (browser.name === 'electron' && browser.isHeadless) {
      launchOptions.preferences['width'] = 1920;
      launchOptions.preferences['height'] = 1080;
      launchOptions.preferences['resizable'] = false;
      return launchOptions
    }
    if (['chrome', 'chromium'].includes(browser.name) && true /*browser.isHeadless*/) {
      launchOptions.args.push('--window-size=1920,1080')
      port = ensureRdpPort(launchOptions.args)
      console.log('ensureRdpPort %d', port)
      debug('Chrome arguments %o', launchOptions.args)
      return launchOptions
    }
  })

  console.log(config)

  config.viewportWidth = 1920
  config.viewportHeight = 1080
  return config
}
