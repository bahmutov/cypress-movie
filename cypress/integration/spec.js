/// <reference types="cypress" />

const getIframesContainer = () =>
  window.parent.window.document.querySelector('.iframes-container')

const findAppRectangle = () => {
  const el = getIframesContainer()
  return el.getClientRects()[0]
}

// because element rectangle does not want to reveal its secrets
const serializeRectangle = (rect) =>
  Cypress._.pick(rect, 'bottom', 'height', 'left', 'top', 'right', 'width')

const addTodo = (text) =>
  cy.get('.new-todo').type(`${text}{enter}`, { delay: 100 })

// scrolls back to the top
// really necessary only if the page is taller than
// the viewportHeight in "cypress.json"
const scroll = () =>
  cy.get('h1', { log: false }).scrollIntoView({
    offset: {
      top: -100,
      left: 0,
    },
    log: false,
  })

const pickFilter = (filter) => {
  cy.contains('footer ul.filters li', filter).should('be.visible').click()
  scroll()
  const hash = filter === 'All' ? '/' : `/${filter.toLowerCase()}`
  cy.location('hash').should('include', hash)
  cy.wait(1000, { log: false })
}

const clearCompleted = () => {
  cy.get('footer button.clear-completed').should('be.visible').click()
  cy.get('footer button.clear-completed').should('not.be.visible')
  scroll()
}

describe('Todo app', () => {
  it('adds and removes completed todos', function () {
    cy.visit('/examples/react/')
    cy.toast(this.test.title, { duration: 3000 })
    cy.get('.new-todo').should('be.visible')
    // screenshots are still imperfect
    // https://github.com/bahmutov/cypress-movie/issues/9
    cy.screenshot('start', { capture: 'viewport' })

    addTodo('this is first todo')
    addTodo('second todo')

    // cy.wait(1000)
    cy.contains('ul.todo-list li', 'second todo').find('input.toggle').click()
    cy.toast('Checked 1 todo')
    scroll()

    cy.contains('.todo-count', '1').should('be.visible')

    cy.toast('Filters: Active / Completed / All')

    // the screenshot does not restore the original
    // position of the application iframe
    // https://github.com/bahmutov/cypress-movie/issues/9
    // let the toast show
    cy.wait(50)
    cy.screenshot('filters', { capture: 'viewport' })

    pickFilter('Active')
    pickFilter('Completed')
    pickFilter('All')

    cy.toast('Clicking "Clear completed" button')
    clearCompleted()

    cy.toast('Completed items have been removed', { duration: 5000 })
  })
})
