/// <reference types="cypress" />
describe('Screenshot examples', () => {
  const addTodo = (text) =>
    cy.get('.new-todo').type(`${text}{enter}`, { delay: 100 })

  it('adds and removes completed todos', function () {
    cy.visit('/examples/react/')

    cy.get('.new-todo').should('be.visible')
    // screenshots are still imperfect
    // https://github.com/bahmutov/cypress-movie/issues/9
    cy.screenshot('start', { capture: 'viewport' }).then(console.log)

    addTodo('This is an example')

    cy.screenshot('finish', { capture: 'viewport', maxWidth: 800 })
  })
})
