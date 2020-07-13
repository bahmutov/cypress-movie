/// <reference types="cypress" />

// load toast pop up library once
// and then inject on each visit
let tinyToastSource

before(function loadTinyToastSource() {
  cy.readFile('./node_modules/tiny-toast/dist/tiny-toast.js', {
    log: false,
  }).then((src) => {
    tinyToastSource = src
  })
})

Cypress.on('window:before:load', (win) => {
  win.eval(tinyToastSource)
})

const maxStringLength = (n) => (s) => {
  return s.length < n ? s : s.slice(0, n) + '...'
}

const maxString = maxStringLength(15)

/**
 * Shows a text message popup and automatically hides it.
 * @param {string} message Text to show
 * @param {object} options Toast options
 */
const toast = (message, options = {}) => {
  Cypress._.defaults(options, {
    duration: 3000,
    blocking: false,
    log: false,
  })

  cy.log(`**toast** ${maxString(message)}`)
  const logOptions = { log: options.log }
  cy.window(logOptions)
    .its('tinyToast', logOptions)
    .invoke(logOptions, 'show', message)
    .invoke(logOptions, 'hide', options.duration)

  if (options.blocking) {
    cy.wait(options.duration, logOptions)
  }

  const doc = cy.state('document')
  const body = doc.body
  Cypress.$(body).append('<style>.tinyToast { z-index: 999999999 }</style>')
}

Cypress.Commands.add('toast', toast)
