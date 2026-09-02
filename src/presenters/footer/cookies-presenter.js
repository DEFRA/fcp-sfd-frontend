/**
 * Formats data ready for presenting in the `/cookies` page
 * @module cookiesPresenter
 */
const cookiesPresenter = (updated, referer = '', cookiesPolicy = {}, errors = {}) => {
  return {
    analytics: {
      idPrefix: 'analytics',
      name: 'analytics',
      fieldset: {
        legend: {
          text: 'Do you want to accept analytics cookies?',
          classes: 'govuk-fieldset__legend--s'
        }
      },
      errorMessage: errors.analytics && { text: errors.analytics.text },
      items: [
        { value: true, text: 'Yes', checked: !!cookiesPolicy.analytics },
        { value: false, text: 'No', checked: !cookiesPolicy.analytics }
      ]
    },
    updated,
    referer
  }
}

export {
  cookiesPresenter
}
