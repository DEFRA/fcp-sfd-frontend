import { describe, test, expect, beforeEach, vi } from 'vitest'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { dalData } from '../../../mockObjects/mock-business-details'

describe('fetchBusinessDetailsService', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = dalData

    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }]),
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }
  })

  describe('when called', () => {
    test('it correctly returns the data', async () => {
      const result = await fetchBusinessDetailsService(yar)

      expect(result).toEqual(data)
    })
  })
})
