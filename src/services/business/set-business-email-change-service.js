/**
 * Fetches the business details associated with the logged in users business
 * @module setBusinessEmailChangeService
 */

const setBusinessEmailChangeService = async (data, yar) => {
  const businessDetails = yar.get('businessDetails')
  const changeBusinessDetails = {
    ...businessDetails,
    changeBusinessEmail: data
  }
  yar.set('businessDetails', changeBusinessDetails)
}

export {
  setBusinessEmailChangeService
}
