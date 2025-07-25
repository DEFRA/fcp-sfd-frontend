import { vi, beforeEach, describe, test, expect } from 'vitest'
import { dalData, mappedData } from '../../mocks/mock-permissions.js'
import { dalConnector } from '../../../src/dal/connector.js'
import { mapPermissions } from '../../../src/mappers/permissions-mapper.js'
import { permissionsQuery } from '../../../src/dal/queries/permissions-query.js'

import { getPermissions } from '../../../src/auth/get-permissions.js'

vi.mock('../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn()
}))

vi.mock('../../../src/mappers/permissions-mapper.js', () => ({
  mapPermissions: vi.fn()
}))

vi.mock('../../../src/dal/queries/permissions-query.js', () => ({
  permissionsQuery: vi.fn()
}))

let sbi
let crn
let email

describe('getPermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    sbi = '234654278765'
    crn = '987645433252'
    email = 'farmer@test.com'

    mapPermissions.mockReturnValue(mappedData)
    dalConnector.mockResolvedValue({ data: dalData })
  })

  test('should call dalConnector ', async () => {
    await getPermissions(sbi, crn, email)
    expect(dalConnector).toHaveBeenCalledWith(permissionsQuery, { sbi, crn }, email)
  })

  test('should call mapPermissions when dalConnector response has data', async () => {
    await getPermissions(sbi, crn, email)
    expect(mapPermissions).toHaveBeenCalledWith(dalData)
  })

  test('should return mapped data  when dalConnector response has data', async () => {
    const result = await getPermissions(sbi, crn, email)
    expect(result).toBe(mappedData)
  })

  test('should not call mapPermissions when dalConnector response has no data', async () => {
    dalConnector.mockResolvedValue({ })
    await getPermissions(sbi, crn, email)
    expect(mapPermissions).not.toHaveBeenCalled()
  })

  test('should return dalConnector response when dalConnector response has no data', async () => {
    const dalResponse = { response: 'no-dal-data' }
    dalConnector.mockResolvedValue(dalResponse)
    const result = await getPermissions(sbi, crn, email)
    expect(result).toBe(dalResponse)
  })
})
