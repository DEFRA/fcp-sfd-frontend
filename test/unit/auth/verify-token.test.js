import { vi, beforeEach, describe, test, expect } from 'vitest'

const mockOidcConfig = { jwks_uri: 'https://example.com/jwks' }
const mockGetOidcConfig = vi.fn()
vi.mock('../../../src/auth/get-oidc-config.js', () => ({
  getOidcConfig: mockGetOidcConfig
}))

const mockJwkKey = { kty: 'RSA', n: 'mock-n', e: 'AQAB' }
const mockWreckGet = vi.fn()
vi.mock('@hapi/wreck', () => ({
  default: {
    get: mockWreckGet
  }
}))

const mockPem = '-----BEGIN PUBLIC KEY-----\nmock-pem\n-----END PUBLIC KEY-----'
const mockExport = vi.fn()
const mockCreatePublicKey = vi.fn()
vi.mock('node:crypto', () => ({
  createPublicKey: mockCreatePublicKey
}))

const mockDecoded = { header: {}, payload: {}, signature: '' }
const mockJwtDecode = vi.fn()
const mockJwtVerify = vi.fn()
vi.mock('@hapi/jwt', () => ({
  default: {
    token: {
      decode: mockJwtDecode,
      verify: mockJwtVerify
    }
  }
}))

const { verifyToken } = await import('../../../src/auth/verify-token.js')

const mockToken = 'mock.jwt.token'

describe('verifyToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetOidcConfig.mockResolvedValue(mockOidcConfig)
    mockWreckGet.mockResolvedValue({ payload: { keys: [mockJwkKey] } })
    mockExport.mockReturnValue(mockPem)
    mockCreatePublicKey.mockReturnValue({ export: mockExport })
    mockJwtDecode.mockReturnValue(mockDecoded)
    mockJwtVerify.mockReturnValue(undefined)
  })

  test('should call getOidcConfig to retrieve the JWKS URI', async () => {
    await verifyToken(mockToken)
    expect(mockGetOidcConfig).toHaveBeenCalledOnce()
  })

  test('should fetch keys from the jwks_uri returned by oidc config', async () => {
    await verifyToken(mockToken)
    expect(mockWreckGet).toHaveBeenCalledWith(mockOidcConfig.jwks_uri, { json: true })
  })

  test('should convert the first JWK to a PEM-encoded public key', async () => {
    await verifyToken(mockToken)
    expect(mockCreatePublicKey).toHaveBeenCalledWith({ key: mockJwkKey, format: 'jwk' })
    expect(mockExport).toHaveBeenCalledWith({ type: 'spki', format: 'pem' })
  })

  test('should decode the token', async () => {
    await verifyToken(mockToken)
    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken)
  })

  test('should verify the decoded token using the PEM key and RS256 algorithm', async () => {
    await verifyToken(mockToken)
    expect(mockJwtVerify).toHaveBeenCalledWith(mockDecoded, { key: mockPem, algorithm: 'RS256' })
  })

  test('should resolve without returning a value on success', async () => {
    const result = await verifyToken(mockToken)
    expect(result).toBeUndefined()
  })

  test('should throw if getOidcConfig fails', async () => {
    mockGetOidcConfig.mockRejectedValue(new Error('OIDC config unavailable'))
    await expect(verifyToken(mockToken)).rejects.toThrow('OIDC config unavailable')
  })

  test('should throw if fetching JWKS fails', async () => {
    mockWreckGet.mockRejectedValue(new Error('JWKS fetch failed'))
    await expect(verifyToken(mockToken)).rejects.toThrow('JWKS fetch failed')
  })

  test('should throw if token decoding fails', async () => {
    mockJwtDecode.mockImplementation(() => { throw new Error('Invalid token format') })
    await expect(verifyToken(mockToken)).rejects.toThrow('Invalid token format')
  })

  test('should throw if token verification fails', async () => {
    mockJwtVerify.mockImplementation(() => { throw new Error('Invalid signature') })
    await expect(verifyToken(mockToken)).rejects.toThrow('Invalid signature')
  })
})
