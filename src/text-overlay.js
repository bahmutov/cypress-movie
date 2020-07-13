/// <reference types="cypress" />

/**
 * Shows text overlay and then removes it.
 */
const textCommand = (text, options = {}) => {
  if (!text) {
    throw new Error('cy.text expects text')
  }
  if (!Cypress._.isString(text)) {
    throw new Error('cy.text expects a string')
  }

  Cypress._.defaults(options, {
    duration: 2000,
    blocking: false,
    textSize: '40pt',
  })

  const doc = cy.state('document')
  const body = doc.body

  const textHtml = `
    <div id="text-overlay-1647"
      style="position: absolute; left: 0; right: 0; bottom: 0;
        text-align:center; width: 100%; padding: 4rem 0;
        font-size: ${options.textSize}; color: white;
        background: linear-gradient(to bottom, rgba(100, 100, 100, 0.3) 0%, rgba(10, 10, 10, 0.5) 40%, rgba(10, 10, 10, 0.5) 70%, rgba(80, 80, 80, 0.3) 100%);
        z-index: 999999999;
        ">
      ${text}
    </div>
  `
  Cypress.$(body).append(textHtml)

  // remove text after "duration" ms
  setTimeout(() => {
    const textElement = doc.getElementById('text-overlay-1647')
    if (textElement) {
      body.removeChild(textElement)
    }
  }, options.duration)

  if (options.blocking) {
    cy.wait(options.duration, { log: false })
  }
}

Cypress.Commands.add('text', textCommand)
