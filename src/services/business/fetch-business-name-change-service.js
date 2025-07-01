import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessNameChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const changeBusinessName = yar.get('businessDetails').changeBusinessName || yar.get('businessDetails').businessName
  return {
    ...yar.get('businessDetails'),
    changeBusinessName
  }
}

export {
  fetchBusinessNameChangeService
}
