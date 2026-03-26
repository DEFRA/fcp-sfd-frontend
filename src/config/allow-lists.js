export const allowListsConfig = {
  allowLists: {
    farmingPaymentsAllowedCrns: {
      doc: 'Allowed CRNs for farming payments',
      format: String,
      default: '',
      env: 'FARMING_PAYMENTS_ALLOWED_CRNS'
    },
    farmingPaymentsAllowedSbis: {
      doc: 'Allowed SBIs for farming payments',
      format: String,
      default: '',
      env: 'FARMING_PAYMENTS_ALLOWED_SBIS'
    }
  }
}
