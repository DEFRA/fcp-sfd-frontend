/**
 * Fetches the business details associated with the logged in users business
 * @module getBusinessEmailChangeService
 */

const getBusinessEmailChangeService = async (request) => {
  const changeBusinessEmail = request.yar.get('businessDetails').changeBusinessEmail ? request.yar.get('businessDetails').changeBusinessEmail : request.yar.get('businessDetails').businessEmail
  return {
    changeBusinessEmail
  }
}

export {
  getBusinessEmailChangeService
}
