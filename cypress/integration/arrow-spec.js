/// <reference types="cypress" />

function getArrowSvg(c_e1, c_e2, strokeWidth=6){
  const arrsvg = `
    <svg id="arrow"
      style="position:absolute; top:0; left:0; margin:0; width:99.8%; height:99.9%;">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refx="3" refy="4" orient="auto">
          <path d="M1,1 L1,7 L7,4 L1,1" style="fill:red;" />
        </marker>
      </defs>
      <path d="M${c_e1.x},${c_e1.y} L${c_e2.x},${c_e2.y}" style="stroke:red; stroke-width: ${strokeWidth}px; fill: none;"/>
    </svg>
    `
  return arrsvg
}

/**
 * Draws an SVG arrow pointing at the given element
 * @param {JQuery<HTMLElement>} $el The element to point at
*/
const arrowCommand = ($el, options = {}) => {
  Cypress._.defaults(options, {
    duration: 2000,
    blocking: false
  })
  console.log('options', options)
  cy.log('**arrow**')
  const r = $el[0].getBoundingClientRect()
  console.log('bounding box', r)
  const to = {
    x: r.left,
    y: r.bottom
  }
  const from = {
    x: r.left - 100,
    y: r.bottom + 100
  }
  const doc = $el[0].ownerDocument
  const body = doc.body

  const arrowSvg = getArrowSvg(from, to)
  // console.log('arrow svg', arrowSvg)
  Cypress.$(body).append(arrowSvg)

  setTimeout(() => {
    const arrowElement = doc.getElementById('arrow')
    if (arrowElement) {
      body.removeChild(arrowElement)
    }
  }, options.duration)

  if (options.blocking) {
    cy.wait(options.duration, {log: false})
  }
  cy.wrap($el, {log: false})
}

Cypress.Commands.add('arrow', { prevSubject: 'element' }, arrowCommand)

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
