export const bankDetailsConfig = {
  bankDetailsConfig: {
    endpoint: {
      doc: 'Endpoint for the fcp-sfd-bank-details service',
      format: String,
      default: null,
      nullable: true,
      env: 'BANK_DETAILS_ENDPOINT'
    },
    audience: {
      doc: 'Audience to request in the AWS WebIdentity token used to authenticate with fcp-sfd-bank-details',
      format: String,
      default: 'fcp-sfd-bank-details',
      env: 'BANK_DETAILS_AUDIENCE'
    }
  }
}
