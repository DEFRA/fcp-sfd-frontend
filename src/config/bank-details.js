// Below the refresh margin the cached token is always treated as expiring, so every call
// would hit STS; above 900 seconds STS rejects the request (AWS limit, see FLS2-377)
const MIN_TOKEN_DURATION_SECONDS = 120
const MAX_TOKEN_DURATION_SECONDS = 900

export const bankDetailsConfig = {
  bankDetails: {
    endpoint: {
      doc: 'Endpoint for the fcp-sfd-bank-details service',
      format: String,
      default: null,
      nullable: true,
      env: 'BANK_DETAILS_ENDPOINT'
    },
    webIdentityToken: {
      audience: {
        doc: 'Audience claim set on the AWS WebIdentity token sent to fcp-sfd-bank-details',
        format: String,
        default: 'fcp-sfd-bank-details',
        env: 'BANK_DETAILS_TOKEN_AUDIENCE'
      },
      durationSeconds: {
        doc: `Duration (seconds) of the AWS WebIdentity token sent to fcp-sfd-bank-details. Must be between ${MIN_TOKEN_DURATION_SECONDS} and ${MAX_TOKEN_DURATION_SECONDS}; AWS allows at most ${MAX_TOKEN_DURATION_SECONDS}.`,
        format: (value) => {
          if (!Number.isInteger(value) || value < MIN_TOKEN_DURATION_SECONDS || value > MAX_TOKEN_DURATION_SECONDS) {
            throw new Error(`must be an integer between ${MIN_TOKEN_DURATION_SECONDS} and ${MAX_TOKEN_DURATION_SECONDS}`)
          }
        },
        default: 300,
        env: 'BANK_DETAILS_TOKEN_DURATION_SECONDS'
      }
    }
  }
}
