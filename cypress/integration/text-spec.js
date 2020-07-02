/// <reference types="cypress" />

describe('Text', () => {
  beforeEach(() => {
    cy.visit('/examples/react/').wait(2000) // let the site load
    cy.get('input').should('be.visible').and('have.focus')
  })

  it('shows the text overlay 🎥', () => {
    cy.text('This is some text', { duration: 2000, blocking: true })
    cy.log('**text done**')
    cy.get('input').type('use cy.text')
  })
})
