/// <reference types="cypress" />

Cypress.Commands.add('toast', (message, duration = 3000) => {
  cy.window({log: false}).its('tinyToast').invoke('show', message).invoke('hide', duration)
  cy.wait(duration, {log: false})
})

const getIframesContainer = () =>
  window.parent.window.document.querySelector('.iframes-container')

const loadTinyToast = (doc) => {
  const tinyToastUrl = 'https://cdn.rawgit.com/bahmutov/tiny-toast/8ab63c4a/dist/tiny-toast.js'
  // const doc = cy.state('document')
  const script_tag = doc.createElement('script')
  script_tag.type = 'text/javascript'
  script_tag.src = tinyToastUrl
  doc.head.appendChild(script_tag)
}

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

it('adds and removes completed todos', function () {
  cy.visit('http://todomvc.com/examples/react/', {
    onBeforeLoad: (win) => {
      loadTinyToast(win.document)
    },
    onLoad: (win) => {
      win.tinyToast.show(this.test.title).hide(3000)
    }
  })
  cy.get('.new-todo').should('be.visible')
  addTodo('this is first todo')
  addTodo('second todo')

  // cy.wait(1000)
  cy.contains('ul.todo-list li', 'second todo').find('input.toggle').check()
  cy.toast('Checked 1 todo')
  scroll()

  cy.contains('.todo-count', '1').should('be.visible')

  cy.toast('Filters: Active / Completed / All')
  pickFilter('Active')
  pickFilter('Completed')
  pickFilter('All')

  cy.toast('Clicking "Clear completed" button')
  clearCompleted()

  cy.toast('Completed items have been removed', 5000)

  cy.then(() => {
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
