export const servicesConfig = {
  servicesConfig: {
    WMPEndpoint: {
      doc: 'Endpoint to reach grants WMP',
      format: String,
      default: null,
      env: 'WMP_ENDPOINT'
    },
    WaterManagementEndpoint: {
      doc: 'Endpoint to reach grants Water Management',
      format: String,
      default: null,
      env: 'WATER_MANAGEMENT_ENDPOINT'
    }
  }
}
