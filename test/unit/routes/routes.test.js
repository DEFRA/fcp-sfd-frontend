// Test framework dependencies
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'

const diagnosticPaths = ['/bank-details-check', '/bank-details-check/{sbi}']

// routes.js decides which routes to include at import time, so re-import per environment
const importRoutesFor = async (environment) => {
  vi.stubEnv('ENVIRONMENT', environment)
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

  test('should not register the bank details diagnostic routes in prod', async () => {
    const paths = await importRoutesFor('prod')

    for (const path of diagnosticPaths) {
      expect(paths).not.toContain(path)
    }
  })

  test.each(['local', 'dev', 'test'])('should register the bank details diagnostic routes in %s', async (environment) => {
    const paths = await importRoutesFor(environment)

    for (const path of diagnosticPaths) {
      expect(paths).toContain(path)
    }
  })
})
