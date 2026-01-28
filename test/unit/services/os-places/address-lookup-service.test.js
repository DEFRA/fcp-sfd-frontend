// Test framework dependencies
import { vi, describe, test, expect, beforeEach } from 'vitest'

// Things we need to mock
import { addressLookupMapper } from '../../../../src/mappers/address-lookup-mapper.js'
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { placesAPI } from 'osdatahub'
import { constants as httpConstants } from 'node:http2'
import { mockPostcode } from '../../../../src/services/os-places/os-places-stub.js'

const mockConfigGet = vi.fn()

// Mocks
vi.mock('../../../../src/mappers/address-lookup-mapper.js', () => ({
  addressLookupMapper: vi.fn()
}))

vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

vi.mock('../../../../src/utils/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    error: vi.fn()
  })
}))

vi.mock('osdatahub', () => ({
  placesAPI: {
    postcode: vi.fn()
  }
}))

vi.mock('../../../../src/services/os-places/os-places-stub.js', () => ({
  mockPostcode: vi.fn()
}))

// Thing under test
const { addressLookupService } = await import('../../../../src/services/os-places/address-lookup-service.js')

describe('addressLookupService', () => {
  const yar = {}
  const postcode = 'SW1A 1AA'
  const mockAddresses = mockData()
  const mappedMockAddresses = mappedMockData()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when osPlacesStub is not enabled', () => {
    beforeEach(async () => {
      mockConfigGet.mockReturnValue({
        clientId: 'fake-client-id',
        osPlacesStub: false
      })
    })

    describe('when called with a valid postcode', () => {
      beforeEach(() => {
        placesAPI.postcode.mockResolvedValue(mockAddresses)
        addressLookupMapper.mockReturnValue(mappedMockAddresses)
      })

      describe('and the context is for the business details data', () => {
        test('returns mapped addresses and sets them in session when API returns results', async () => {
          const result = await addressLookupService(postcode, yar, 'business')

          expect(result).toEqual(mappedMockAddresses)
          expect(addressLookupMapper).toHaveBeenCalledWith(mockAddresses.features)
          expect(setSessionData).toHaveBeenCalledWith(
            yar,
            'businessDetailsUpdate',
            'changeBusinessAddresses',
            mappedMockAddresses
          )
        })
      })

      describe('and the context is for the personal details data', () => {
        test('returns mapped addresses and sets them in session when API returns results', async () => {
          const result = await addressLookupService(postcode, yar, 'personal')

          expect(result).toEqual(mappedMockAddresses)
          expect(addressLookupMapper).toHaveBeenCalledWith(mockAddresses.features)
          expect(setSessionData).toHaveBeenCalledWith(
            yar,
            'personalDetailsUpdate',
            'changePersonalAddresses',
            mappedMockAddresses
          )
        })
      })
    })

    describe('when called with a postcode that returns no addresses', () => {
      beforeEach(() => {
        placesAPI.postcode.mockResolvedValue({ features: [] })
      })

      test('returns a Joi-like error object', async () => {
        const result = await addressLookupService(postcode, yar, 'business')

        expect(result).toEqual({
          error: [
            {
              message: 'No addresses found for this postcode',
              path: ['postcode']
            }
          ]
        })
        expect(addressLookupMapper).not.toHaveBeenCalled()
        expect(setSessionData).not.toHaveBeenCalled()
      })
    })

    describe('when the API errors', () => {
      let error

      beforeEach(() => {
        error = new Error('Network error')
        placesAPI.postcode.mockRejectedValue(error)
      })

      test('returns error object', async () => {
        const result = await addressLookupService(postcode, yar)

        expect(result).toEqual({
          statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
          errors: [error]
        })
        expect(addressLookupMapper).not.toHaveBeenCalled()
        expect(setSessionData).not.toHaveBeenCalled()
      })
    })
  })

  describe('when osPlacesStub is enabled', () => {
    beforeEach(async () => {
      mockConfigGet.mockReturnValue({
        clientId: 'fake-client-id',
        osPlacesStub: true
      })

      mockPostcode.mockReturnValue(mockData())
      addressLookupMapper.mockReturnValue(mappedMockAddresses)
    })

    test('calls mockPostcode instead of the real API and returns mapped results', async () => {
      const result = await addressLookupService(postcode, yar, 'business')

      expect(mockPostcode).toHaveBeenCalledWith(postcode)
      expect(placesAPI.postcode).not.toHaveBeenCalled()
      expect(addressLookupMapper).toHaveBeenCalledWith(mockData().features)
      expect(result).toEqual(mappedMockAddresses)
    })
  })
})

const mappedMockData = () => {
  return [
    {
      displayAddress: '123 Test Street, LONDON, E1 6AN',
      buildingName: 'Test Organisation',
      flatName: null,
      buildingNumberRange: '123',
      street: 'Test Street',
      dependentLocality: 'London Borough of Tower Hamlets',
      doubleDependentLocality: 'London Borough of Tower Hamlets',
      city: 'LONDON',
      county: 'CITY OF LONDON',
      postcode: 'E1 6AN',
      country: 'England',
      uprn: '1001'
    }
  ]
}

const mockData = () => {
  return {
    features: [
      {
        properties: {
          UPRN: '1001',
          ADDRESS: '123 Test Street, LONDON, E1 6AN',
          ORGANISATION_NAME: 'Test Organisation',
          BUILDING_NUMBER: '123',
          THOROUGHFARE_NAME: 'Test Street',
          DOUBLE_DEPENDENT_LOCALITY: 'London Borough of Tower Hamlets',
          DEPENDENT_LOCALITY: 'London Borough of Tower Hamlets',
          POST_TOWN: 'LONDON',
          POSTCODE: 'E1 6AN',
          LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'CITY OF LONDON',
          COUNTRY_CODE: 'E'
        }
      }
    ]
  }
}
