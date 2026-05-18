// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { pageNotFoundPresenter } from '../../../../src/presenters/errors/page-not-found-presenter.js'

describe('pageNotFoundPresenter', () => {
  test('it correctly presents the data when a back link is provided', () => {
    const result = pageNotFoundPresenter('/previous-page')

    expect(result).toEqual({
      backLink: '/previous-page',
      pageTitle: 'Page not found',
      metaDescription: 'We could not find this page. Check the web address is correct and try again.',
      contactHelpLink: '/contact-help'
    })
  })

  test('it correctly presents the data when no back link is provided', () => {
    const result = pageNotFoundPresenter(undefined)

    expect(result).toEqual({
      backLink: undefined,
      pageTitle: 'Page not found',
      metaDescription: 'We could not find this page. Check the web address is correct and try again.',
      contactHelpLink: '/contact-help'
    })
  })
})
