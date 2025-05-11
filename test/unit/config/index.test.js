import { jest, beforeEach, describe, test, expect } from '@jest/globals'

describe('Config', () => {
  describe('DefraId', () => {
    beforeEach(() => {
      jest.resetModules()
      process.env.DEFRA_ID_WELL_KNOWN_URL = 'mockWellKnownUrl'
      process.env.DEFRA_ID_CLIENT_ID = 'mockClientId'
      process.env.DEFRA_ID_CLIENT_SECRET = 'mockClientSecret'
      process.env.DEFRA_ID_SERVICE_ID = 'mockServiceId'
      process.env.DEFRA_ID_POLICY = 'mockPolicy'
      process.env.DEFRA_ID_REDIRECT_URL = 'mockRedirectUrl'
      process.env.DEFRA_ID_SIGN_OUT_REDIRECT_URL = 'mockSignOutRedirectUrl'
      process.env.DEFRA_ID_REFRESH_TOKENS = 'false'
    })

    test('should return well known url from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.wellKnownUrl')).toBe('mockWellKnownUrl')
    })

    test('should return empty string if well known url environment variable is not set', async () => {
      delete process.env.DEFRA_ID_WELL_KNOWN_URL
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.wellKnownUrl')).toBe('')
    })

    test('should return client id from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.clientId')).toBe('mockClientId')
    })

    test('should return empty string if client id environment variable is not set', async () => {
      delete process.env.DEFRA_ID_CLIENT_ID
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.clientId')).toBe('')
    })

    test('should return client secret from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.clientSecret')).toBe('mockClientSecret')
    })

    test('should return empty string if client secret environment variable is not set', async () => {
      delete process.env.DEFRA_ID_CLIENT_SECRET
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.clientSecret')).toBe('')
    })

    test('should return service id from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.serviceId')).toBe('mockServiceId')
    })

    test('should return empty string if service id environment variable is not set', async () => {
      delete process.env.DEFRA_ID_SERVICE_ID
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.serviceId')).toBe('')
    })

    test('should return policy from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.policy')).toBe('mockPolicy')
    })

    test('should return empty string if policy environment variable is not set', async () => {
      delete process.env.DEFRA_ID_POLICY
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.policy')).toBe('')
    })

    test('should return redirect url from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.redirectUrl')).toBe('mockRedirectUrl')
    })

    test('should return empty string if redirect url environment variable is not set', async () => {
      delete process.env.DEFRA_ID_REDIRECT_URL
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.redirectUrl')).toBe('')
    })

    test('should return sign out redirect url from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.signOutRedirectUrl')).toBe('mockSignOutRedirectUrl')
    })

    test('should return empty string if sign out redirect url environment variable is not set', async () => {
      delete process.env.DEFRA_ID_SIGN_OUT_REDIRECT_URL
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.signOutRedirectUrl')).toBe('')
    })

    test('should return refresh tokens from environment variable if set', async () => {
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.refreshTokens')).toBe(false)
    })

    test('should default to refreshing tokens if environment variable is not set', async () => {
      delete process.env.DEFRA_ID_REFRESH_TOKENS
      const { config } = await import('../../../src/config/index.js')
      expect(config.get('defraId.refreshTokens')).toBe(true)
    })
  })
})
