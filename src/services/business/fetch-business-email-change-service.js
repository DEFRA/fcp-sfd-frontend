import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessEmailChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const changeBusinessEmail = yar.get('businessDetails').changeBusinessEmail || yar.get('businessDetails').contact.email

  return {
    ...yar.get('businessDetails'),
    changeBusinessEmail
  }
}

export {
  fetchBusinessEmailChangeService
}
