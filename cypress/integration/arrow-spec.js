/// <reference types="cypress" />

describe('Arrows', () => {
  beforeEach(() => {
    cy.visit('/examples/react/').wait(1000) // let the site load
  })
  it('shows arrow pointing at the element (non-blocking)', function () {
    cy.get('.new-todo')
      .arrow({
        duration: 3000,
        strokeWidth: 3,
      })
      .type('See this arrow?')
  })

  it('shows arrow pointing at the element (blocking)', function () {
    cy.get('.new-todo')
      .arrow({
        duration: 3000,
        blocking: true,
      })
      .type('Did you see an arrow?!')
  })

  it('from different directions 🎥', function () {
    cy.get('.new-todo')
      .type('Write test{enter}')
      .type('Render test as demo movie{enter}')
    // .screenshot('before-arrows', { capture: 'viewport' })

    cy.contains('.filters li', 'All').arrow({
      duration: 1000,
      offsetX: -10,
      offsetY: 20,
      blocking: true,
      color: 'blue',
      text: 'Show all todos',
    })

    cy.contains('.filters li', 'Active').arrow({
      duration: 1000,
      offsetX: -10,
      offsetY: 20,
      blocking: true,
      color: 'green',
      label: 'Unfinished todos only',
    })

    cy.contains('.filters li', 'Completed')
      .arrow({
        duration: 3000,
        pointAt: 'bottomRight',
        blocking: true,
        offsetX: 50,
        offsetY: 20,
        color: '#ff00ff',
        text: 'Completed todos only',
        textSize: '5vh',
      })
      .wait(1000)
  })
})
