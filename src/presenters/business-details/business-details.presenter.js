/**
 * Formats data for the `/business-details` page
 * @module BusinessDetailsPresenter
 */

/**
 *
 * @param {*} request
 */
function go (request) {
  const { showSuccessBanner: showSuccessBannerRaw, successField, ...state } = request.state
  console.log('🚀 request.state:', request.state)
  console.log('🚀 state:', state)
  console.log('🚀 showSuccessBannerRaw:', showSuccessBannerRaw)
  console.log('🚀 successField:', successField)

  return {
    pageTitle: 'View and update your business details',
    description: 'View and change the details for your business.',
    name: '',
    telephone: '',
    mobile: '',
    address1: '',
    address2: '',
    city: '',
    county: '',
    postcode: '',
    country: '',
    email: '',
    formattedAddress: _formatAddress(),
    showSuccessBanner: ''
  }
}

export const BusinessDetailsPresenter = {
  go
}
