const cypress = require('cypress')

cypress.run({
  spec: 'cypress/integration/gif-spec.js'
})
  .then(results => {
    // console.log(JSON.stringify(results, null, 2))

    // for each results.runs
    //  get tests
    //    each test
    //      has title string[]
    //      videoTimestamp (ms)
    //      wallClockDuration
    // we cut and crop the movie for each test nicely.

    results.runs.forEach(run => {
      run.tests.forEach(test => {
        console.log(test)
        // console.log(test.title, test.videoTimestamp, test.wallClockDuration)
      })
    })

    console.log(JSON.stringify(results.runs, null, 2))
  })
