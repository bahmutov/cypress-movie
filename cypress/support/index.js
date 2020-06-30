/// <reference types="cypress" />

import '../../commands'
import { slowDownCommands } from '../../src/slow-down'

slowDownCommands()

before(() => {
  if (Cypress.browser.isHeadless) {
    cy.clearViewport()
  }
})
