/// <reference types="cypress" />

import overwriteDefault from './command-overwrites/default.js'
import overwriteClick from './command-overwrites/click.js'
import overwriteType from './command-overwrites/type.js'
import overwriteVisit from './command-overwrites/visit.js'

/**
 * Overwrites some common Cypress commands like "cy.click", "cy.type"
 * by adding a pause after the command.
 * @param {number} pauseMs - pause to add after the command, default 1000ms
 */
export const slowDownCommands = (pauseMs = 1000) => {
  // could be all commands
  // const commandsToSlowDown = Object.keys(Cypress.Commands._commands)
  const commandsToSlowDown = [
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

  commandsToSlowDown.forEach((command) => {
    const options = {
      pauseMs
    }
    console.log(options)

    if (typeof command === 'object') {
      Cypress.Commands.overwrite(command.name, command.action.bind(null, options))
    } else if (typeof command === 'string') {
      Cypress.Commands.overwrite(command, overwriteDefault.bind(null, options))
    }
  })
}