/// <reference types="cypress" />

describe('Arrows', () => {
  it('shows arrow pointing at the element (non-blocking)', function () {
    cy.visit('/examples/react/')

    cy.get('.new-todo')
      .arrow({
        duration: 3000,
        strokeWidth: 3,
      })
      .type('See this arrow?')
  })

  it('shows arrow pointing at the element (blocking)', function () {
    cy.visit('/examples/react/')

    cy.get('.new-todo')
      .arrow({
        duration: 3000,
        blocking: true,
      })
      .type('Did you see an arrow?!')
  })

  it('from different directions 🎥', function () {
    cy.visit('/examples/react/')

    cy.get('.new-todo')
      .type('Write test{enter}')
      .type('Render test as demo movie{enter}')
      .screenshot('before-arrows', { capture: 'viewport' })

    cy.contains('.filters li', 'All').arrow({
      duration: 1000,
      offsetX: -10,
      offsetY: 20,
      blocking: true,
      color: 'blue',
    })

    cy.contains('.filters li', 'Active').arrow({
      duration: 1000,
      offsetX: -10,
      offsetY: 20,
      blocking: true,
      color: 'green',
    })

    cy.contains('.filters li', 'Completed').arrow({
      duration: 2000,
      pointAt: 'bottomRight',
      blocking: true,
      offsetX: 50,
      offsetY: 20,
      color: '#ff00ff',
    })
  })
})
