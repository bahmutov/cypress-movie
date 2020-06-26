/// <reference types="cypress" />

// could be all commands
// const commandsToSlowDown = Object.keys(Cypress.Commands._commands)
const commandsToSlowDown = ['click', 'check']
const PAUSE_MS = 1000
commandsToSlowDown.forEach(commandName => {
  Cypress.Commands.overwrite(commandName, (commandFn, ...args) => {
    return commandFn(...args).then(subject => {
      return Cypress.Promise.resolve(subject).delay(PAUSE_MS)
    })
  })
})

const clearViewport = () => {
  const runnerContainer = window.parent.document.getElementsByClassName(
    "iframes-container"
  )[0];
  runnerContainer.setAttribute(
    "style",
    "left: 0; top: 0; width: 100%; height: 100%;"
  );

  const sizeContainer = window.parent.document.getElementsByClassName(
    "size-container"
  )[0];
  sizeContainer.setAttribute("style", "");

  const sidebar = window.parent.document.getElementsByClassName(
    "reporter-wrap"
  )[0];
  sidebar.setAttribute("style", "opacity: 0");

  const header = window.parent.document.querySelector(
    ".runner.container header"
  );
  header.setAttribute("style", "opacity: 0");
}
Cypress.Commands.add("clearViewport", clearViewport);

// trying to overwrite the "cy.screenshot" command to restore full view
Cypress.Commands.overwrite('screenshot', (screenshot, ...args) => {
  return screenshot(...args).then(() => {
    if (Cypress.browser.isHeadless) {
      // go back to "full application view"
      setTimeout(clearViewport, 0)
    }
  })
})

before(() => {
  if (Cypress.browser.isHeadless) {
    cy.clearViewport()
  }
})
