export const allowListsConfig = {
  allowLists: {
    woodlandManagementAllowListCrns: {
      doc: 'Allowed CRNs for woodland management',
      format: String,
      default: '',
      env: 'WOODLAND_MANAGEMENT_ALLOWED_CRNS'
    },
    woodlandManagementAllowListSbis: {
      doc: 'Allowed SBIs for woodland management',
      format: String,
      default: '',
      env: 'WOODLAND_MANAGEMENT_ALLOWED_SBIS'
    }
  }
}
