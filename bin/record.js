#!/usr/bin/env node

const arg = require('arg')
const cypress = require('cypress')
const fs = require('fs').promises
const execa = require('execa')
const path = require('path')
const _ = require('lodash')
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
        console.log(test)
        console.log('from video', run.video)
        console.log(
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
        const outputName = path.join(OUTPUT_FOLDER, testTitles) + extension
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
        console.log(
          'ffmpeg arguments: %s %s',
          ffmpegPath,
          ffmpegArguments.join(' '),
        )
        const execaResult = await execa(ffmpegPath, ffmpegArguments)
        // console.log(execaResult)
      }
      // console.log(test.title, test.videoTimestamp, test.wallClockDuration)
    }
  }

  console.log('exiting with code %d', results.totalFailed)
  process.exit(results.totalFailed)
}

const args = arg({
  '--spec': String,
  '--width': Number,
  '--fps': Number,
  '--format': String,
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

cypress
  .run({
    spec: args['--spec'],
    browser: 'chrome',
    headless: true,
  })
  .then(processTestResults(processingOptions))
