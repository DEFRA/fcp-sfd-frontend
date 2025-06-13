/**
 * Sets the phone numbers associated with the logged in users business in the session cache to be reviewed
 * @module setBusinessPhoneNumberService
 */

const setBusinessPhoneNumberService = async (data, yar) => {
  const businessDetails = yar.get('businessDetails')
  const changeBusinessDetails = {
    ...businessDetails,
    changeBusinessTelephone: data.businessTelephone,
    changeBusinessMobile: data.businessMobile
  }
  yar.set('businessDetails', changeBusinessDetails)
}

export {
  setBusinessPhoneNumberService
}
