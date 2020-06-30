/// <reference types="cypress" />

const isChromeLike = (browserName) =>
  ['chrome', 'chromium'].includes(browserName)

Cypress.Commands.overwrite('screenshot', function (screenshot, ...args) {
  // if (Cypress.browser.isHeadless) {
  // TODO this should only happen during movie mode
  console.log('screenshots args', args)
  // for now only handle viewport and ignore subject
  const [subject, name, options] = args
  if (options.capture !== 'viewport' || !isChromeLike(Cypress.browser.name)) {
    return screenshot(...args)
  }

  return cy.task('takeScreenshot', {
    name,
    options,
    spec: Cypress.spec,
    screenshotFolder: Cypress.config('screenshotsFolder'),
  })
})
