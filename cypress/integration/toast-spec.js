/// <reference types="cypress" />

describe('Toast', () => {
  it('shows text', function () {
    cy.visit('/examples/react/')
    cy.get('.new-todo').should('be.visible')
    cy.toast('Todo App', { duration: 3000, blocking: true })
  })
})
