export const allowListsConfig = {
  allowLists: {
    farmingPaymentsAllowListCrns: {
      doc: 'Allowed CRNs for farming payments',
      format: String,
      default: '',
      env: 'FARMING_PAYMENTS_ALLOWED_CRNS'
    },
    farmingPaymentsAllowListSbis: {
      doc: 'Allowed SBIs for farming payments',
      format: String,
      default: '',
      env: 'FARMING_PAYMENTS_ALLOWED_SBIS'
    }
  }
}
