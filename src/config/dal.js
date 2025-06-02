export const dalConfig = {
  dalConfig: {
    emailAddress: {
      doc: 'Email address to communicate with data access layer (DAL)',
      format: 'String',
      default: 'test.user11@defra.gov.uk',
      env: 'DAL_EMAIL_ADDRESS'
    },
    endpoint: {
      doc: 'API endpoint to retrieve data from the data access layer (DAL)',
      format: 'String',
      default: 'http://fcp-dal-api:3005/graphql',
      env: 'DAL_ENDPOINT'
    }
  }
}
