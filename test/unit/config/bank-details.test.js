// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { bankDetailsConfig } from '../../../src/config/bank-details.js'

const { format } = bankDetailsConfig.bankDetails.webIdentityToken.durationSeconds

describe('bank details config', () => {
  describe('webIdentityToken.durationSeconds', () => {
    describe('when the value is 120', () => {
      test('it is accepted', () => {
        expect(() => format(120)).not.toThrow()
      })
    })

    describe('when the value is 300', () => {
      test('it is accepted', () => {
        expect(() => format(300)).not.toThrow()
      })
    })

    describe('when the value is 900', () => {
      test('it is accepted', () => {
        expect(() => format(900)).not.toThrow()
      })
    })

    // At or below the 60s refresh margin the cache is never used; above 900 AWS rejects the call
    describe('when the value is 60', () => {
      test('it is rejected', () => {
        expect(() => format(60)).toThrow('must be an integer between 120 and 900')
      })
    })

    describe('when the value is 119', () => {
      test('it is rejected', () => {
        expect(() => format(119)).toThrow('must be an integer between 120 and 900')
      })
    })

    describe('when the value is 901', () => {
      test('it is rejected', () => {
        expect(() => format(901)).toThrow('must be an integer between 120 and 900')
      })
    })

    describe('when the value is 3600', () => {
      test('it is rejected', () => {
        expect(() => format(3600)).toThrow('must be an integer between 120 and 900')
      })
    })

    describe('when the value is not an integer (300.5)', () => {
      test('it is rejected', () => {
        expect(() => format(300.5)).toThrow('must be an integer between 120 and 900')
      })
    })

    describe('when the value is a string ("300")', () => {
      test('it is rejected', () => {
        expect(() => format('300')).toThrow('must be an integer between 120 and 900')
      })
    })

    describe('when the value is null', () => {
      test('it is rejected', () => {
        expect(() => format(null)).toThrow('must be an integer between 120 and 900')
      })
    })
  })
})
