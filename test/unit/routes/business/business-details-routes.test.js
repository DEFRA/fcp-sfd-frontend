// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { businessDetailsService } from '../../../../src/services/business/business-details.service.js'

// Thing under test
import { businessDetailsRoutes } from '../../../../src/routes/business/business-details.routes.js'
const [getBusinessDetails] = businessDetailsRoutes

// Mock the service
vi.mock('../../../../src/services/business/business-details.service.js', () => ({
  businessDetailsService: vi.fn()
}))

describe('business details', () => {
  let h
  let request

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /business-details', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        request = {}
        businessDetailsService.mockResolvedValue({})
      })

      test('it calls the business details service', async () => {
        await getBusinessDetails.handler(request, h)

        expect(businessDetailsService).toHaveBeenCalled(request)
        expect(h.view).toHaveBeenCalledWith('business/business-details.njk', {})
      })
    })
  })
})
