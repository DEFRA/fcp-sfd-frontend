import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessPhoneNumbersChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const changeBusinessPhones = yar.get('businessDetails').changeBusinessPhones || yar.get('businessDetails').businessPhones
  return {
    ...yar.get('businessDetails'),
    changeBusinessPhones
  }
}

export {
  fetchBusinessPhoneNumbersChangeService
}
