/// <reference types="cypress" />
import { cursorTrackingCommands } from './src/cursor-tracking'

import './src/screenshot'
import './src/arrow'
import './src/clear-viewport'
import './src/toast'
import './src/text-overlay'

const cursorEnabled = Cypress._.get(Cypress.env(), 'cypress-movie.cursorTracking.enabled')

if (cursorEnabled) {
  cursorTrackingCommands()
}
