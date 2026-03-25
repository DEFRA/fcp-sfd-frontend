// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
const mockConfigGet = vi.fn()

vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

// Thing under test
const { allowListService } = await import('../../../src/services/allow-list-service.js')

describe('allowListService', () => {
  const sbi = 123456789
  const crn = 987654321

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns true when CRN and SBI are both in the allow lists', () => {
    mockConfigGet.mockImplementation((key) => ({
      'allowLists.farmingPaymentsWhitelistCrns': ' 987654321 ',
      'allowLists.farmingPaymentsWhitelistSbis': '123456789'
    })[key])

    const result = allowListService(sbi, crn, 'farmingPayments')

    expect(result).toBe(true)
  })

  test('returns false when one of the allow lists is empty', () => {
    mockConfigGet.mockImplementation((key) => ({
      'allowLists.farmingPaymentsWhitelistCrns': '987654321',
      'allowLists.farmingPaymentsWhitelistSbis': ''
    })[key])

    const result = allowListService(sbi, crn, 'farmingPayments')

    expect(result).toBe(false)
  })

  test('returns false when schema is not recognised', () => {
    const result = allowListService(sbi, crn, 'unknownSchema')

    expect(result).toBe(false)
  })

  test('returns false when an allow list is an empty CSV string', () => {
    mockConfigGet.mockImplementation((key) => ({
      'allowLists.farmingPaymentsWhitelistCrns': ' , ,   ',
      'allowLists.farmingPaymentsWhitelistSbis': '123456789'
    })[key])

    const result = allowListService(sbi, crn, 'farmingPayments')

    expect(result).toBe(false)
  })
})
