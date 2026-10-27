export const bankDetailsConfig = {
  bankDetailsConfig: {
    endpoint: {
      doc: 'Endpoint for the fcp-sfd-bank-details service',
      format: String,
      default: null,
      nullable: true,
      env: 'BANK_DETAILS_ENDPOINT'
    },
    tokenAudience: {
      doc: 'Audience claim set on the AWS WebIdentity token sent to fcp-sfd-bank-details',
      format: String,
      default: 'fcp-sfd-bank-details',
      env: 'BANK_DETAILS_TOKEN_AUDIENCE'
    },
    tokenDurationSeconds: {
      doc: 'Duration (seconds) of the AWS WebIdentity token sent to fcp-sfd-bank-details',
      format: Number,
      default: 300,
      env: 'BANK_DETAILS_TOKEN_DURATION_SECONDS'
    }
  }
}
