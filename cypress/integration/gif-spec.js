/// <reference types="cypress" />

describe('Gifs', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/')
  })

  it('shows different pages', () => {
    cy.wait(1000)
    cy.contains('.nav li', 'Utilities').click().wait(1000)
    cy.contains('.nav li', 'Cypress API').click().wait(1000)
  })
})
