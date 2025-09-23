export const osPlacesConfig = {
  osPlacesConfig: {
    endpoint: {
      doc: 'API endpoint to retrieve data from the os places API',
      format: String,
      default: null,
      env: 'OS_PLACES_ENDPOINT'
    },
    tokenEndpoint: {
      doc: 'Token endpoint for retrieving an identity and authentication token for OS Places',
      format: String,
      default: null,
      env: 'OS_PLACES_TOKEN_ENDPOINT'
    },
    clientId: {
      doc: 'Client ID for authenticating with OS Places',
      format: String,
      default: null,
      env: 'OS_PLACES_CLIENT_ID'
    },
    clientSecret: {
      doc: 'Client secret for authentication with OS Places',
      format: String,
      default: null,
      env: 'OS_PLACES_CLIENT_SECRET',
      sensitive: true
    }
  }
}
