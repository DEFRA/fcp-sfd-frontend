// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { getAllowedGrants } from '../../../../src/services/grants/get-allowed-grants-service.js'

// Mock dependencies
import { config } from '../../../../src/config/index.js'
import { proxyFetch } from '../../../../src/utils/proxy.js'

// Mock imports
vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

vi.mock('../../../../src/utils/proxy.js', () => ({
  proxyFetch: vi.fn()
}))

// The logger reads config at module load, which the mocked config above cannot satisfy
vi.mock('../../../../src/utils/logger.js', () => ({
  createLogger: () => ({
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  })
}))

vi.mock('../../../../src/utils/grants/build-grants-api-headers.js', () => ({
  buildAuthorizationHeader: vi.fn().mockReturnValue('Bearer test-token'),
  buildUserContextHeader: vi.fn().mockReturnValue('test-user-context')
}))

describe('getAllowedGrantsService', () => {
  const sbi = 123456789
  const crn = 987654321

  beforeEach(() => {
    vi.clearAllMocks()

    config.get.mockReturnValue({
      baseUrl: 'http://grants-api.test',
      timeout: 3000
    })
  })

  describe('when the Grants API returns grants', () => {
    beforeEach(() => {
      proxyFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          grants: [
            { code: 'woodland', title: 'Woodland Management Plan' },
            { code: 'grasslands', title: 'Grasslands' }
          ]
        })
      })
    })

    test('it returns the grants', async () => {
      const result = await getAllowedGrants(sbi, crn)

      expect(result).toEqual([
        { code: 'woodland', title: 'Woodland Management Plan' },
        { code: 'grasslands', title: 'Grasslands' }
      ])
    })

    test('it calls the allow list endpoint with both authentication headers', async () => {
      await getAllowedGrants(sbi, crn)

      expect(proxyFetch).toHaveBeenCalledWith(
        'http://grants-api.test/allowlist/grants',
        expect.objectContaining({
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-token',
            'x-user-context': 'test-user-context'
          }
        })
      )
    })
  })

  describe('when the user is allowed no grants', () => {
    beforeEach(() => {
      proxyFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ grants: [] })
      })
    })

    test('it returns an empty array', async () => {
      const result = await getAllowedGrants(sbi, crn)

      expect(result).toEqual([])
    })
  })

  describe.each([401, 500])('when the Grants API responds with a %i', (status) => {
    beforeEach(() => {
      proxyFetch.mockResolvedValue({
        ok: false,
        status
      })
    })

    test('it returns an empty array rather than throwing', async () => {
      const result = await getAllowedGrants(sbi, crn)

      expect(result).toEqual([])
    })
  })

  describe('when the Grants API cannot be reached', () => {
    beforeEach(() => {
      proxyFetch.mockRejectedValue(new Error('fetch failed'))
    })

    test('it returns an empty array rather than throwing', async () => {
      const result = await getAllowedGrants(sbi, crn)

      expect(result).toEqual([])
    })
  })
})
