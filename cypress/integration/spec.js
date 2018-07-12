/// <reference types="cypress" />

const getIframesContainer = () =>
  window.parent.window.document.querySelector('.iframes-container')

const findAppRectangle = () => {
  const el = getIframesContainer()
  return el.getClientRects()[0]
}

// because element rectangle does not want to reveal its secrets
const serializeRectangle = (rect) =>
  Cypress._.pick(rect, 'bottom', 'height', 'left', 'top', 'right', 'width')

it('works', () => {
  cy.visit('http://todomvc.com/examples/react/')
  cy.get('.new-todo').should('be.visible')
  cy.wait(1000)
  .then(() => {
    const rect = findAppRectangle()
    const size = serializeRectangle(rect)
    console.log(size)
    // return cy.task('size', size)
    const s = JSON.stringify(size, null, 2) + '\n'
    cy.writeFile('size.json', s, 'utf8')
  })
  // capture several resolutions
  cy.screenshot('runner', {
    capture: 'runner'
  })
  // cy.screenshot('app', {
  //   capture: 'viewport'
  // })
  // cy.screenshot('full', {
  //   capture: 'fullPage'
  // })
})
