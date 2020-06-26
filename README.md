# cypress-movie [![ci status][ci image]][ci url] [![renovate-app badge][renovate-badge]][renovate-app]
> Exploring how one can generate product demo videos from Cypress tests

Example capturing high resolution video of the test run with additional message pop ups (using [tiny-toast](https://github.com/bahmutov/tiny-toast) library injected on `cy.visit`)

![Video at 1920x1080](images/movie-screenshot.png)

The movies are generated at 1920x1080, the headless browser is set to the same size. The command log is hidden, thus the app takes the entire video. Here is a still from a movie generated on CI with its dimensions shown.

Related video: [WeAreDevs presentation](https://www.youtube.com/watch?v=p38bIMC-YOU) - start watching at minute 34. Presentation slides at [slides.com/bahmutov/e2e-in-the-future](https://slides.com/bahmutov/e2e-in-the-future).

## Details

When using `cypress run` the headless browser is set to use 1920x1080 resolution from the [cypress/plugins/index.js](cypress/plugins/index.js) file. The viewport width and height are also set to the same values using the config object. During the test run, the Command Log is hidden before the test, see [cypress/support/index.js](cypress/support/index.js) file.

## Continuous Integration

I could reliably generate 1920x1080 movies on CI only by using headless Chrome browser. For example see [GitHub Actions ci.yml](.github/workflows/ci.yml) file.

## Feedback

If you have ideas in what directions this could go - please open an issue in this repo. I would love to hear them.

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

[ci image]: https://github.com/bahmutov/cypress-movie/workflows/ci/badge.svg?branch=master
[ci url]: https://github.com/bahmutov/cypress-movie/actions
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
