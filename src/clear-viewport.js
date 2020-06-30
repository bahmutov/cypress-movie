/// <reference types="cypress" />

/**
 * Takes the application under test iframe and expands it
 * to cover the entire browser window.
 */
const clearViewport = () => {
  const runnerContainer = window.parent.document.getElementsByClassName(
    'iframes-container',
  )[0]
  runnerContainer.setAttribute(
    'style',
    'left: 0; top: 0; width: 100%; height: 100%;',
  )

  const sizeContainer = window.parent.document.getElementsByClassName(
    'size-container',
  )[0]
  sizeContainer.setAttribute('style', '')

  const sidebar = window.parent.document.getElementsByClassName(
    'reporter-wrap',
  )[0]
  sidebar.setAttribute('style', 'opacity: 0')

  const header = window.parent.document.querySelector(
    '.runner.container header',
  )
  header.setAttribute('style', 'opacity: 0')
}

Cypress.Commands.add('clearViewport', clearViewport)
