import { vi, beforeEach, describe, test, expect } from 'vitest'
import { signedOut } from '../../../src/routes/signed-out-routes'

import { signedOutPresenter } from '../../../src/presenters/signed-out-presenter'

const mockView = vi.fn()

const mockH = {
  view: vi.fn().mockReturnValue(mockView)
}

vi.mock('../../../src/presenters/signed-out-presenter', () => ({
  signedOutPresenter: vi.fn()
}))

const mockSignedOutPresenter = {
  title: 'Test Title',
  content: 'Test content'
}

describe('Signed out endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    signedOutPresenter.mockReturnValue(mockSignedOutPresenter)
  })

  test('should have the correct method and path', () => {
    expect(signedOut.method).toBe('GET')
    expect(signedOut.path).toBe('/signed-out')
  })

  test('should render the signed-out view with signedOutPresenter', () => {
    const result = signedOut.handler(null, mockH)

    expect(mockH.view).toHaveBeenCalledWith('signed-out.njk', mockSignedOutPresenter)

    expect(result).toBe(mockView)
  })
})
