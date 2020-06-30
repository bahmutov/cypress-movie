#!/usr/bin/env node

const cypress = require('cypress')
const fs = require('fs').promises
const execa = require('execa')
const path = require('path')
const _ = require('lodash')

const OUTPUT_FOLDER = path.join('cypress', 'movies')

const MOVIE_SYMBOL = '🎥'
const MOVIE_REGEX = /🎥/g

/**
 * Converts ms since the start of the video to
 * what ffmpeg expects HH:MM:SS.mmm
 */
const msToTimestamp = (ms) => {
  const hours = Math.floor(ms / (3600 * 1000))
  ms = ms % (3600 * 1000)
  const minutes = Math.floor(ms / (60 * 1000))
  ms = ms % (3600 * 1000)
  const seconds = Math.floor(ms / 1000)
  ms = ms % 1000

  return `${hours}:${minutes}:${seconds}.${ms}`
}

const processTestResults = async (results) => {
  if (results.failures) {
    // something went terribly wrong
    console.error(results.message)
    process.exit(1)
  }

  await fs.mkdir(OUTPUT_FOLDER, { recursive: true })

  results.runs.forEach((run) => {
    run.tests.forEach(async (test) => {
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
        const outputName = path.join(OUTPUT_FOLDER, testTitles) + '.gif'
        const ffmpegArguments = [
          '-i',
          run.video,
          '-ss',
          msToTimestamp(test.videoTimestamp),
          '-t',
          msToTimestamp(test.wallClockDuration),
          '-y',
          '-vf',
          'fps=10,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
          '-loop',
          0,
          outputName,
        ]
        console.log('ffmpeg arguments: %s', ffmpegArguments.join(' '))
        await execa('ffmpeg', ffmpegArguments)
      }
      // console.log(test.title, test.videoTimestamp, test.wallClockDuration)
    })
  })

  console.log('exiting with code %d', results.totalFailed)
  process.exit(results.totalFailed)
}

cypress
  .run({
    spec: 'cypress/integration/gif-spec.js',
    browser: 'chrome',
    headless: true,
  })
  .then(processTestResults)
