/**
 * Stub personal-business details returned when the DAL connection is disabled
 * (e.g. local development or feature flag off). Matches the shape produced by
 * mapPersonalBusinessDetails from the DAL response.
 *
 * @module mockPersonalBusinessDetails
 */

const mappedData = {
  info: {
    userName: 'John Doe'
  },
  business: {
    info: {
      sbi: '123456789',
      name: 'Acme Farms Ltd',
      organisationId: '5565448'
    }
  }
}

export {
  mappedData
}
