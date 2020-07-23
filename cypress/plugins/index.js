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
// @ts-ignore
const _ = require('lodash')
const sharp = require('sharp')

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
const initTakingScreenshot = (commonOptions) => async (
  screenshotOptions = {},
) => {
  _.defaults(commonOptions, {
    width: 1920,
    height: 1080,
    projectRoot: process.cwd(),
  })
  debug('taking screenshot')
  debug('options %o, %o', commonOptions, screenshotOptions)

  debug('await client on port %d', port)
  client = client || (await CDP({ port }))

  const device = {
    width: commonOptions.width,
    height: commonOptions.height,
    deviceScaleFactor: 1,
    mobile: false,
    fitWindow: false,
  }

  // set viewport and visible size
  await client.send('Emulation.setDeviceMetricsOverride', device)
  await client.send('Emulation.setVisibleSize', {
    width: commonOptions.width,
    height: commonOptions.height,
  })

  const result = await client.send('Page.captureScreenshot', {
    format: 'png',
  })
  debug('took screenshot')
  const decoded = Buffer.from(result.data, 'base64')

  debug('joining folder', screenshotOptions.screenshotFolder)
  const outputFolder = path.join(
    screenshotOptions.screenshotFolder,
    screenshotOptions.spec.name,
  )
  const screenshotFilename = path.join(
    outputFolder,
    screenshotOptions.name + '.png',
  )
  debug('saving %s', screenshotFilename)
  await fs.mkdir(outputFolder, { recursive: true })

  let outputWidth = commonOptions.width
  let outputHeight = commonOptions.height

  if (screenshotOptions.options.maxWidth) {
    debug(
      'resizing the screenshot to maxWidth %d',
      screenshotOptions.options.maxWidth,
    )
    await new Promise((resolve, reject) => {
      sharp(decoded)
        // @ts-ignore
        .resize(screenshotOptions.options.maxWidth)
        .toFile(screenshotFilename, (err, info) => {
          if (err) {
            debug(err)
            return reject(err)
          }
          // info is an object like
          // info {
          //   format: 'png',
          //   width: 800,
          //   height: 450,
          //   channels: 4,
          //   premultiplied: true,
          //   size: 40948
          // }
          debug('resized image info %o', info)
          outputWidth = info.width
          outputHeight = info.height
          resolve()
        })
    })
  } else {
    debug('saving full screenshot')
    await fs.writeFile(screenshotFilename, decoded)
  }
  debug('saved %s', screenshotFilename)

  const screenshotRelative = path.relative(
    commonOptions.projectRoot,
    screenshotFilename,
  )
  console.log(
    '  Screenshot %s %dx%d',
    screenshotRelative,
    outputWidth,
    outputHeight,
  )

  return screenshotFilename
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const pluginOptions = _.get(config, 'env.cypress-movie', {})
  _.defaults(pluginOptions, {
    enabled: true,
    cursorTracking: {
      enabled: false,
      shape: "dot"
    },
    width: 1920,
    height: 1080,
  })
  debug('cypress-movie options %o', pluginOptions)
  if (!pluginOptions.enabled) {
    return
  }

  const takeScreenshot = initTakingScreenshot({
    width: pluginOptions.width,
    height: pluginOptions.height,
    projectRoot: config.projectRoot,
  })
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
      debug(
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
