// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { getConfigService } from '../../../src/services/get-config-service.js'

// Mock dependencies
import { config } from '../../../src/config/index.js'

// Mock imports
vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

describe('getConfigService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when passed a config path', () => {
    beforeEach(() => {
      config.get.mockReturnValue(true)
    })

    test('it fetches the config for that path', () => {
      getConfigService('featureToggle.viewLand')

      expect(config.get).toHaveBeenCalledWith('featureToggle.viewLand')
    })

    test('it returns the config value', () => {
      const result = getConfigService('featureToggle.viewLand')

      expect(result).toBe(true)
    })
  })
})
