/// <reference types="cypress" />
import { msToTimestamp } from '../../bin/utils'

describe('Bin utils', () => {
  context('msToTimestamp', () => {
    it('converts correctly', () => {
      expect(msToTimestamp(1000)).to.equal('00:00:01.000')
      expect(msToTimestamp(1001)).to.equal('00:00:01.001')
      cy.log('**padding end**').then(() => {
        expect(msToTimestamp(10)).to.equal('00:00:00.010')
        expect(msToTimestamp(30000)).to.equal('00:00:30.000')
      })
      cy.log('**minutes**').then(() => {
        expect(msToTimestamp(5 * 60 * 1000)).to.equal('00:05:00.000')
      })
      cy.log('**hours**').then(() => {
        expect(msToTimestamp(121 * 60 * 1000)).to.equal('02:01:00.000')
      })
    })
  })
})
