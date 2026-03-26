export const allowListsConfig = {
  allowLists: {
    farmingPaymentsWhitelistCrns: {
      doc: 'Allowed CRNs for farming payments',
      format: String,
      default: '',
      env: 'FARMING_PAYMENTS_WHITELIST_CRNS'
    },
    farmingPaymentsWhitelistSbis: {
      doc: 'Allowed SBIs for farming payments',
      format: String,
      default: '',
      env: 'FARMING_PAYMENTS_WHITELIST_SBIS'
    }
  }
}
