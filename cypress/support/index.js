/// <reference types="cypress" />

import '../../commands'
import { slowDownCommands } from '../../src/slow-down'
import { cursorTrackingCommands } from '../../src/cursor-tracking'

if (Cypress.env()['cypress-movie'].cursorTracking.enabled) {
  cursorTrackingCommands()
} else {
  slowDownCommands()
}

before(() => {
  if (Cypress.browser.isHeadless) {
    cy.clearViewport()
  }
})
