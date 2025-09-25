import { createLogger } from '../../utils/logger.js'
import { getTokenService } from './get-token-service.js'
import { getTokenCache } from '../../utils/caching/token-cache.js'
import { placesAPI } from 'osdatahub'
import { config } from '../../config/index.js'

const logger = createLogger()

export const OSPlacesConnectorService = async (postcode) => {
  // const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase()
  // console.log('🚀 ~ cleanPostcode:', cleanPostcode)

  // const tokenCache = getTokenCache()
  // console.log('🚀 ~ tokenCache:', tokenCache)

  try {
    const { clientId } = config.get('osPlacesConfig')
    // Ask about limit
    // E14 9GU - This postcode returns 86 results, Emma wants to see them on the next page
    const addresses = await placesAPI.postcode(clientId, 'E14 9GU', { limit: 150 })
    console.log('🚀 ~ addresses:', addresses)
    console.log('🚀 ~ addresses.features:', addresses.features)
    console.log('🚀 ~ addresses.features[0].geometry:', addresses.features[0].geometry)
    console.log('🚀 ~ addresses.features[0].properties:', addresses.features[0].properties)

    // const bearerToken = await getTokenService(tokenCache)
    // console.log('🚀 ~ bearerToken:', bearerToken)

    // Clean up postcode: strip spaces, uppercase
    // Generate bearer token

  } catch (error) {
    console.log('🚀 ~ error inside try catch:', error)
    return error
  }
}
