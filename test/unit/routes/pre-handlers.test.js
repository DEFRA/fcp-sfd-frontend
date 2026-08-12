// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things under test
import { checkSessionDataGuard } from '../../../src/routes/pre-handlers.js'

describe('pre-handlers', () => {
  let h
  let takeoverMock

  beforeEach(() => {
    vi.clearAllMocks()

    takeoverMock = vi.fn().mockReturnValue({})
    h = {
      redirect: vi.fn().mockReturnValue({ takeover: takeoverMock }),
      continue: {}
    }
  })

  describe('checkSessionDataGuard', () => {
    let request

    beforeEach(() => {
      request = {
        yar: {
          get: vi.fn()
        }
      }
    })

    describe('when checking a single field', () => {
      describe('and the field exists in session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({
            changePersonalDob: '1990-01-15'
          })
        })

        test('it should allow the request to continue', async () => {
          const guard = checkSessionDataGuard('changePersonalDob', '/personal-details', 'personalDetailsUpdate')
          const result = await guard.method(request, h)

          expect(result).toBe(h.continue)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })

      describe('and the field is missing from session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({})
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard('changePersonalDob', '/personal-details', 'personalDetailsUpdate')
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/personal-details')
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and session data is not set', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue(null)
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard('changePersonalDob', '/personal-details', 'personalDetailsUpdate')
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/personal-details')
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and the field has a falsy value (but is present)', () => {
        test('it should allow the request to continue when value is false', async () => {
          request.yar.get.mockReturnValue({
            changePersonalChoice: false
          })
          const guard = checkSessionDataGuard('changePersonalChoice', '/personal-details', 'personalDetailsUpdate')
          const result = await guard.method(request, h)

          expect(result).toBe(h.continue)
          expect(h.redirect).not.toHaveBeenCalled()
        })

        test('it should allow the request to continue when value is 0', async () => {
          request.yar.get.mockReturnValue({
            changePersonalNumber: 0
          })
          const guard = checkSessionDataGuard('changePersonalNumber', '/personal-details', 'personalDetailsUpdate')
          const result = await guard.method(request, h)

          expect(result).toBe(h.continue)
          expect(h.redirect).not.toHaveBeenCalled()
        })

        test('it should allow the request to continue when value is empty string', async () => {
          request.yar.get.mockReturnValue({
            changePersonalText: ''
          })
          const guard = checkSessionDataGuard('changePersonalText', '/personal-details', 'personalDetailsUpdate')
          const result = await guard.method(request, h)

          expect(result).toBe(h.continue)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })
    })

    describe('when checking multiple fields', () => {
      describe('and all fields exist in session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({
            changeBusinessPostcode: { postcode: 'SW1A 1AA' },
            changeBusinessAddresses: [{ address: '10 Downing Street' }]
          })
        })

        test('it should allow the request to continue', async () => {
          const guard = checkSessionDataGuard(
            ['changeBusinessPostcode', 'changeBusinessAddresses'],
            '/business-details',
            'businessDetailsUpdate'
          )
          const result = await guard.method(request, h)

          expect(result).toBe(h.continue)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })

      describe('and some fields are missing from session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({
            changeBusinessPostcode: { postcode: 'SW1A 1AA' }
            // changeBusinessAddresses is missing
          })
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard(
            ['changeBusinessPostcode', 'changeBusinessAddresses'],
            '/business-details',
            'businessDetailsUpdate'
          )
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and all fields are missing from session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({})
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard(
            ['changeBusinessPostcode', 'changeBusinessAddresses'],
            '/business-details',
            'businessDetailsUpdate'
          )
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(takeoverMock).toHaveBeenCalled()
        })
      })
    })

    describe('when session key does not match', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue(null)
      })

      test('it should look up the correct session key', async () => {
        const guard = checkSessionDataGuard('changePersonalEmail', '/personal-details', 'personalDetailsUpdate')
        await guard.method(request, h)

        expect(request.yar.get).toHaveBeenCalledWith('personalDetailsUpdate')
      })

      test('it should redirect if the correct session key has no data', async () => {
        const guard = checkSessionDataGuard('changeBusinessName', '/business-details', 'businessDetailsUpdate')
        await guard.method(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })
    })

    describe('redirect behavior', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue({})
      })

      test('it should call redirect with the correct path', async () => {
        const redirectPath = '/account-details'
        const guard = checkSessionDataGuard('changePersonalPhone', redirectPath, 'personalDetailsUpdate')
        await guard.method(request, h)

        expect(h.redirect).toHaveBeenCalledWith(redirectPath)
      })

      test('it should call takeover on the redirect response', async () => {
        const guard = checkSessionDataGuard('changeBusinessVat', '/business-details', 'businessDetailsUpdate')
        await guard.method(request, h)

        expect(takeoverMock).toHaveBeenCalled()
      })
    })
  })
})
