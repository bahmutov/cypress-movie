/// <reference types="cypress" />

import overwriteDefault from './cursor-tracking-commands/default.js'
import overwriteClick from './cursor-tracking-commands/click.js'
import overwriteType from './cursor-tracking-commands/type.js'
import overwriteVisit from './cursor-tracking-commands/visit.js'

/**
 * Overwrites some common Cypress commands like "cy.click", "cy.type" or "cy.visit"
 * by adding a pause and a animated moving cursor.
 * @param {number} pauseMs - pause to add after the command, default 1000ms
 */
export const cursorTrackingCommands = (pauseMs = 1000) => {
  const commandOverwrites = [
    // Can be either an object containing name and action OR a string
    {
      name: 'click',
      action: overwriteClick
    }, {
      name: 'type',
      action: overwriteType
    }, {
      name: 'visit',
      action: overwriteVisit
    }
  ]

  commandOverwrites.forEach((command) => {
    const options = {
      pauseMs
    }

    if (typeof command === 'object') {
      Cypress.Commands.overwrite(command.name, command.action.bind(null, options))
    } else if (typeof command === 'string') {
      Cypress.Commands.overwrite(command, overwriteDefault.bind(null, options))
    }
  })
}
