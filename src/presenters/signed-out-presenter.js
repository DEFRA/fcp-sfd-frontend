/**
 * Formats data ready for presenting in the `/signed-out` page
 * @module signedOutPresenter
 */

const signedOutPresenter = () => {
  return {
    pageTitle: 'You have signed out',
    metaDescription: 'If this is not what you wanted, you can',
    signInText: 'sign back into Land and farm service',
    signInLink: '/auth/sign-in'
  }
}

export {
  signedOutPresenter
}
