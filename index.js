const cypress = require('cypress')

cypress.run()
  .then(results => {
    // for each results.runs
    //  get tests
    //    each test
    //      has title string[]
    //      videoTimestamp (ms)
    //      wallClockDuration
    // we cut and crop the movie for each test nicely.

    console.log(JSON.stringify(results.runs, null, 2))
  })
