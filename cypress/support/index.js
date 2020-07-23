/// <reference types="cypress" />

import '../../commands'
import { slowDownCommands } from '../../src/slow-down'
import { cursorTrackingCommands } from '../../src/cursor-tracking'

// use Cypress._.get to safely get nested property
const cursorEnabled = Cypress._.get(Cypress.env(), 'cypress-movie.cursorTracking.enabled')
if (cursorEnabled) {
  cursorTrackingCommands()
} else {
  slowDownCommands()
}

before(() => {
  if (Cypress.browser.isHeadless) {
    cy.clearViewport()
  }
})
