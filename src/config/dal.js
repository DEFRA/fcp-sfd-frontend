export const dalConfig = {
  dalConfig: {
    localDalEmailAddress: {
      doc: 'Test email to communicate with data access layer (DAL)',
      format: 'String',
      default: 'test.user11@defra.gov.uk',
      env: 'LOCAL_DAL_EMAIL_ADDRESS'
    },
    localDalEndpoint: {
      doc: 'Local endpoint to retrieve data from the data access layer (DAL)',
      format: 'String',
      default: 'http://fcp-dal-api:3005/graphql',
      env: 'LOCAL_DAL_ENDPOINT'
    }
  }
}
