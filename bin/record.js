#!/usr/bin/env node

const arg = require('arg')
const cypress = require('cypress')
const fs = require('fs').promises
const execa = require('execa')
const path = require('path')
const _ = require('lodash')
const debug = require('debug')('cypress-movie')
const { msToTimestamp } = require('./utils')

const OUTPUT_FOLDER = path.join('cypress', 'movies')

const MOVIE_SYMBOL = '🎥'
const MOVIE_REGEX = /🎥/g

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

const processTestResults = (processingOptions = {}) => async (results) => {
  _.defaults(processingOptions, {
    width: 960,
    fps: 10,
    format: 'gif',
  })

  if (results.failures) {
    // something went terribly wrong
    console.error(results.message)
    process.exit(1)
  }

  await fs.mkdir(OUTPUT_FOLDER, { recursive: true })

  for await (let run of results.runs) {
    for await (let test of run.tests) {
      if (!run.video) {
        return
      }
      // if the test name includes the special movie string
      // then we want to convert this particular test into a movie
      if (test.title[test.title.length - 1].includes(MOVIE_SYMBOL)) {
        debug(test)
        debug('from video', run.video)
        debug(
          'starts at %dms and goes for %dms',
          test.videoTimestamp,
          test.wallClockDuration,
        )
        const testTitles = test.title
          .map(_.deburr)
          .map(_.kebabCase)
          .join('-')
          .replace(MOVIE_REGEX, 'movie')

        // gif or mp4
        const extension = '.' + processingOptions.format
        const specName = _.last(run.spec.name.split('/'))
        const outputName =
          path.join(OUTPUT_FOLDER, specName + '_' + testTitles) + extension
        const outputPath = path.resolve(outputName)

        let ffmpegArguments

        // video transform argument
        if (processingOptions.format === 'gif') {
          ffmpegArguments = [
            '-i',
            run.video,
            '-ss',
            msToTimestamp(test.videoTimestamp),
            '-t',
            msToTimestamp(test.wallClockDuration),
            '-y',
            '-vf',
            `fps=${processingOptions.fps},scale=${processingOptions.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
            '-loop',
            0,
            outputPath,
          ]
        } else if (processingOptions.format === 'mp4') {
          ffmpegArguments = [
            '-i',
            run.video,
            '-ss',
            msToTimestamp(test.videoTimestamp),
            '-t',
            msToTimestamp(test.wallClockDuration),
            '-y',
            '-vf',
            `fps=${processingOptions.fps},scale=${processingOptions.width}:-1:flags=lanczos`,
            '-loop',
            0,
            outputPath,
          ]
        } else {
          throw new Error(`Unknown output format ${processingOptions.format}`)
        }
        debug('ffmpeg arguments: %s %s', ffmpegPath, ffmpegArguments.join(' '))
        const execaResult = await execa(ffmpegPath, ffmpegArguments)
        debug('execa code %d', execaResult.exitCode)
        if (execaResult.exitCode) {
          console.error(execaResult)
        } else {
          console.log('Cypress %s %s', MOVIE_SYMBOL, outputName)
        }
      }
      // console.log(test.title, test.videoTimestamp, test.wallClockDuration)
    }
  }

  debug('exiting with code %d', results.totalFailed)
  process.exit(results.totalFailed)
}

const args = arg({
  '--spec': String,
  '--width': Number,
  '--fps': Number,
  '--format': String,
  '--browser': String,
  // Alias
  '-s': '--spec',
  '-w': '--width',
  '-f': '--format',
})

const processingOptions = {
  width: args['--width'],
  fps: args['--fps'],
  format: args['--format'],
}

const browserPath = args['--browser'] || 'chrome'

cypress
  .run({
    spec: args['--spec'],
    browser: browserPath,
    headless: true,
  })
  .then(processTestResults(processingOptions))
