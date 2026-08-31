import { describe, test, expect } from 'vitest'
import { cookiesPresenter } from '../../../../src/presenters/footer/cookies-presenter.js'

describe('cookiesPresenter', () => {
  test('should mark "Yes" as checked when analytics cookies are accepted', () => {
    const result = cookiesPresenter(false, '/some-path', { analytics: true })

    expect(result.analytics.items).toEqual([
      { value: true, text: 'Yes', checked: true },
      { value: false, text: 'No', checked: false }
    ])
  })

  test('should mark "No" as checked when analytics cookies are rejected', () => {
    const result = cookiesPresenter(false, '/some-path', { analytics: false })

    expect(result.analytics.items).toEqual([
      { value: true, text: 'Yes', checked: false },
      { value: false, text: 'No', checked: true }
    ])
  })

  test('should default to "No" checked when no cookies policy is passed', () => {
    const result = cookiesPresenter(false, '/some-path')

    expect(result.analytics.items).toEqual([
      { value: true, text: 'Yes', checked: false },
      { value: false, text: 'No', checked: true }
    ])
  })

  test('should pass through updated and referer', () => {
    const result = cookiesPresenter(true, '/some-path', { analytics: true })

    expect(result.updated).toBe(true)
    expect(result.referer).toBe('/some-path')
  })

  test('should default referer to an empty string when not provided', () => {
    const result = cookiesPresenter(false)

    expect(result.referer).toBe('')
  })
})
