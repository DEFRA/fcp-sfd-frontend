export const servicesConfig = {
  servicesConfig: {
    WMPEndpoint: {
      doc: 'Endpoint to reach grants WMP',
      format: String,
      default: null,
      nullable: true,
      env: 'WMP_ENDPOINT'
    },
    WaterManagementEndpoint: {
      doc: 'Endpoint to reach grants Water Management',
      format: String,
      default: null,
      nullable: true,
      env: 'WATER_MANAGEMENT_ENDPOINT'
    }
  }
}
