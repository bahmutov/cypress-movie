/// <reference types="cypress" />

let cursorCss

/**
 * Overwrites some common Cypress commands like "cy.click", "cy.type"
 * by adding a pause after the command.
 * @param {number} pauseMs - pause to add after the command, default 1000ms
 */
export const slowDownCommands = (pauseMs = 1000) => {
  before(function loadCursorCss() {
    cy.readFile('src/css/cursor.css', {
      log: false,
    }).then((css) => {
      cursorCss = css
    })
  })

  // could be all commands
  // const commandsToSlowDown = Object.keys(Cypress.Commands._commands)
  const commandsToSlowDown = ['click', 'check']
  commandsToSlowDown.forEach((commandName) => {
    Cypress.Commands.overwrite(commandName, (commandFn, subject, ...args) => {
      return cy
        .wrap(subject)
        .trigger('mousemove')
        .wait(pauseMs).then(() => {
          return commandFn(subject, ...args)
        })
    })
  })

  Cypress.Commands.overwrite('type', (originalFn, subject, ...args) => {
    cy
      .wrap(subject)
      .trigger('mousemove')
      .wait(pauseMs)

      .trigger('click')
      .focus()

      .wait(500).then(() => {
        return originalFn(subject, ...args)
      })
  })

  Cypress.Commands.overwrite('visit', (commandFn, ...args) => {
    return commandFn(...args).then(window => {
      const cursorElement = window.document.createElement('div')

      const onMouseMove = (event) => {
        cursorElement.style.left = `${ event.pageX }px`
        cursorElement.style.top = `${ event.pageY }px`
      }

      const onClick = () => {
        cursorElement.classList.remove('cypress__cursor--click')
        void cursorElement.offsetWidth // Prevent browser from batching remove and add class commands -> force repaint so css animation runs again
        cursorElement.classList.add('cypress__cursor--click')
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('click', onClick)

      cursorElement.setAttribute('class', 'cypress__cursor')

      Cypress.$('body').append(cursorElement)
      Cypress.$('body').append(`<style>${cursorCss}</style>`)

      return Cypress.Promise.resolve(window)
    })
  })
}