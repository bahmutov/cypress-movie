/// <reference types="cypress" />

function getArrowSvg(c_e1, c_e2, options = {}) {
  Cypress._.defaults(options, {
    strokeWidth: 5,
    color: 'orange',
  })
  console.log('arrow options', options)
  // arrow from https://vanseodesign.com/web-design/svg-markers/
  const arrsvg = `
    <svg id="arrow"
      style="position:absolute; top:0; left:0; margin:0; width:99.8%; height:99.9%;">
      <defs>
        <marker id="arrow-marker" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="${options.color}" />
        </marker>
      </defs>

      <line x1="${c_e1.x}" y1="${c_e1.y}" x2="${c_e2.x - 20}" y2="${
    c_e2.y + 20
  }" stroke="${options.color}" stroke-width="${
    options.strokeWidth
  }" marker-end="url(#arrow-marker)" />
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
    blocking: false,
    offsetX: 0,
    offsetY: 0,
    // by default point at the element's bottom left corner
    pointAt: 'bottomLeft',
    color: 'cyan',
    strokeWidth: 5,
    color: 'orange',
  })
  // console.log('options', options)
  cy.log('**arrow**')
  const r = $el[0].getBoundingClientRect()
  // console.log('bounding box', r)

  const directions = {
    bottomLeft: {
      x: 'left',
      y: 'bottom',
    },
    bottomRight: {
      x: 'right',
      y: 'bottom',
    },
  }
  const pointAt = directions[options.pointAt] || directions.bottomLeft
  const to = {
    x: r[pointAt.x] + options.offsetX,
    y: r[pointAt.y] + options.offsetY,
  }

  const arrowFromDirections = {
    bottomLeft: {
      x: -120,
      y: 120,
    },
    bottomRight: {
      x: 120,
      y: 120,
    },
  }
  const pointFrom =
    arrowFromDirections[options.pointAt] || arrowFromDirections.bottomLeft

  const from = {
    x: to.x + pointFrom.x,
    y: to.y + pointFrom.y,
  }
  // console.log('arrow from', from, 'to', to)

  const doc = $el[0].ownerDocument
  const body = doc.body

  const arrowSvg = getArrowSvg(from, to, {
    strokeWidth: options.strokeWidth,
    color: options.color,
  })
  // console.log('arrow svg', arrowSvg)
  Cypress.$(body).append(arrowSvg)

  // remove the arrow after "duration" ms
  setTimeout(() => {
    const arrowElement = doc.getElementById('arrow')
    if (arrowElement) {
      body.removeChild(arrowElement)
    }
  }, options.duration)

  if (options.blocking) {
    cy.wait(options.duration, { log: false })
  }
  cy.wrap($el, { log: false })
}

Cypress.Commands.add('arrow', { prevSubject: 'element' }, arrowCommand)
