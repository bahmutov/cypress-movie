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
  cy.get('.new-todo').type(`${text}{enter}`)

// scrolls back to the top
// really necessary only if the page is taller than
// the viewportHeight in "cypress.json"
const scroll = () =>
  cy.get('h1', {log: false}).scrollIntoView({
    offset: {
      top: -100,
      left: 0
    },
    log: false
  })

const pickFilter = (filter) => {
  cy.contains('footer ul.filters li', filter).should('be.visible').click()
  scroll()
  const hash = filter === 'All' ? '/' : `/${filter.toLowerCase()}`
  cy.location('hash').should('include', hash)
  cy.wait(1000, {log: false})
}

const clearCompleted = () => {
  cy.get('footer button.clear-completed').should('be.visible').click()
  cy.get('footer button.clear-completed').should('not.be.visible')
  scroll()
}

it('adds and removes completed todos', () => {
  cy.visit('http://todomvc.com/examples/react/')
  cy.get('.new-todo').should('be.visible')
  addTodo('this is first todo')
  addTodo('second todo')

  // cy.wait(1000)
  cy.contains('ul.todo-list li', 'second todo').find('input.toggle').check()
  scroll()

  cy.contains('.todo-count', '1').should('be.visible')
  // cy.wait(100)
  pickFilter('Active')
  pickFilter('Completed')
  pickFilter('All')

  clearCompleted()

  addTodo('Completed items have been removed')

  cy.wait(1000)
  .then(() => {
    const rect = findAppRectangle()
    const size = serializeRectangle(rect)
    console.log(size)
    // return cy.task('size', size)
    const s = JSON.stringify(size, null, 2) + '\n'
    cy.writeFile('size.json', s, 'utf8')
  })

  // capture several resolutions
  // cy.screenshot('runner', {
  //   capture: 'runner'
  // })
  // cy.screenshot('app', {
  //   capture: 'viewport'
  // })
  // cy.screenshot('full', {
  //   capture: 'fullPage'
  // })
})
