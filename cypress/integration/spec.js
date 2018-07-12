/// <reference types="cypress" />
it('works', () => {
  cy.visit('http://todomvc.com/examples/react/')
  cy.get('.new-todo').should('be.visible')
  cy.wait(1000)
  .then(() => {
    console.log(window.screen)
    const doc = cy.state('document')
    const rect = doc.body.getClientRects()[0]
    console.log(rect)
    const size = Cypress._.pick(rect, 'bottom', 'height', 'left', 'top', 'right', 'width')
    console.log(size)
    return cy.task('size', size)
  })
  cy.screenshot('app', {
    capture: 'viewport'
  })
})
