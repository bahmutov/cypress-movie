/// <reference types="cypress" />

describe('Arrows', () => {
  it('shows arrow pointing at the element (non-blocking)', function () {
    cy.visit('/examples/react/')

    cy.get('.new-todo').arrow({
      duration: 3000
    })
    .type('See this arrow?')
  })

  it('shows arrow pointing at the element (blocking)', function () {
    cy.visit('/examples/react/')

    cy.get('.new-todo').arrow({
      duration: 3000,
      blocking: true
    })
    .type('Did you see an arrow?!')
  })
})
