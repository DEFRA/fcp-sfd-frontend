// Test framework dependencies
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'

// routes.js decides which routes to include at import time, so re-import per environment
const importRoutesFor = async (environment) => {
  vi.stubEnv('ENVIRONMENT', environment)
  vi.resetModules()

  const { routes } = await import('../../../src/routes/routes.js')

  return routes.map((route) => route.path)
}

const importRoutesWithViewLandToggle = async (toggleValue) => {
  vi.stubEnv('VIEW_LAND_ENABLED', toggleValue)
  vi.resetModules()

  const { routes } = await import('../../../src/routes/routes.js')

  return routes.map((route) => route.path)
}

describe('routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('when the viewLand feature toggle is on', () => {
    test('it registers the view land route', async () => {
      const paths = await importRoutesWithViewLandToggle('true')

      expect(paths).toContain('/view-land')
    })
  })

  describe('when the viewLand feature toggle is off', () => {
    test('it does not register the view land route', async () => {
      const paths = await importRoutesWithViewLandToggle('false')

      expect(paths).not.toContain('/view-land')
    })
  })

  describe('when the environment is "prod"', () => {
    test('it does not register the bank details diagnostic routes', async () => {
      const paths = await importRoutesFor('prod')

      expect(paths).not.toContain('/bank-details-check')
    })
  })

  describe('when the environment is "ext-test"', () => {
    test('it does not register the bank details diagnostic routes', async () => {
      const paths = await importRoutesFor('ext-test')

      expect(paths).not.toContain('/bank-details-check')
    })
  })

  describe('when the environment is "perf-test"', () => {
    test('it does not register the bank details diagnostic routes', async () => {
      const paths = await importRoutesFor('perf-test')

      expect(paths).not.toContain('/bank-details-check')
    })
  })

  describe('when the environment is "local"', () => {
    test('it registers the bank details diagnostic routes', async () => {
      const paths = await importRoutesFor('local')

      expect(paths).toContain('/bank-details-check')
    })
  })

  describe('when the environment is "dev"', () => {
    test('it registers the bank details diagnostic routes', async () => {
      const paths = await importRoutesFor('dev')

      expect(paths).toContain('/bank-details-check')
    })
  })

  describe('when the environment is "test"', () => {
    test('it registers the bank details diagnostic routes', async () => {
      const paths = await importRoutesFor('test')

      expect(paths).toContain('/bank-details-check')
    })
  })
})
