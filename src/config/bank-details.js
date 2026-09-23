export const bankDetailsConfig = {
  bankDetailsConfig: {
    endpoint: {
      doc: 'Endpoint for the fcp-sfd-bank-details service',
      format: String,
      default: null,
      nullable: true,
      env: 'BANK_DETAILS_ENDPOINT'
    }
  }
}
