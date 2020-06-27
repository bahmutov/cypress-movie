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

  it('from different directions', function () {
    cy.visit('/examples/react/')

    cy.get('.new-todo')
      .type('Write test{enter}')
      .type('Render test as demo movie{enter}')

    cy.contains('.filters li', 'All').arrow({
      duration: 1000,
      offsetX: -10,
      offsetY: 20,
      blocking: true,
    })

    cy.contains('.filters li', 'Active').arrow({
      duration: 1000,
      offsetX: -10,
      offsetY: 20,
      blocking: true,
    })

    cy.contains('.filters li', 'Completed').arrow({
      duration: 2000,
      pointAt: 'bottomRight',
      blocking: true,
      offsetX: 50,
      offsetY: 20,
    })
  })
})
