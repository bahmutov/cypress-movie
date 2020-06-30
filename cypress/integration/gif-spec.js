/// <reference types="cypress" />

describe('Gifs', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/')
    cy.wait(1000) // make sure the page fully loads
  })

  // any test with 🎥 emoji will become a gif
  // in cypress/movies folder
  it('shows different pages 🎥', () => {
    cy.wait(1000)
    cy.contains('.nav li', 'Utilities').click().wait(1000)
    cy.contains('.nav li', 'Cypress API').click().wait(2000)
  })
})
