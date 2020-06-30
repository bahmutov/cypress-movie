/// <reference types="cypress" />

describe('Toast', () => {
  beforeEach(() => {
    cy.visit('/examples/react/')
    cy.get('.new-todo').should('be.visible')
  })

  it('shows text 🎥', function () {
    cy.wait(1000)
    cy.toast('Todo App', { duration: 4000, blocking: true })
    cy.wait(2000)
  })
})
