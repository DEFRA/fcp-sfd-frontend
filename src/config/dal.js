export const dalConfig = {
  dalConfig: {
    endpoint: {
      doc: 'API endpoint to retrieve data from the data access layer (DAL)',
      format: String,
      default: null,
      env: 'DAL_ENDPOINT'
    },
    tenantId: {
      doc: 'Azure AD Tenant ID for authentication',
      format: String,
      default: null,
      env: 'DAL_TENANT_ID'
    },
    tokenEndpoint: {
      doc: 'Token endpoint for retrieving OIDC token for DAL',
      format: String,
      default: null,
      env: 'DAL_TOKEN_ENDPOINT'
    },
    clientId: {
      doc: 'Client ID for authenticating with the DAL',
      format: String,
      default: null,
      env: 'DAL_CLIENT_ID'
    },
    clientSecret: {
      doc: 'Client secret for authentication with the DAL',
      format: String,
      default: null,
      env: 'DAL_CLIENT_SECRET',
      sensitive: true
    }
  }
}
