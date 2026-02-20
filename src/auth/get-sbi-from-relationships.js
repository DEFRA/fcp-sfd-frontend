/**
 * Get the SBI (Service Business Identifier) from the relationships array
 * for a given organisation ID.
 *
 * A user may change their "active" organisation throughout their journey which will
 * result in multiple organisation values set in the token.
 *
 * We need to ensure that we're extracting the SBI of the currently selected organisation.
 *
 * @param {string} organisationId - The ID of the organisation to find.
 *
 * @param {Array<string>} relationships - The array of relationships to search in the format "organisationId:sbi:role".
 *
 * @returns {string|null} - The found SBI or null if not found.
 */

function getSbiFromRelationships (organisationId, relationships) {
  for (const relationship of relationships) {
    const [orgId, sbi] = relationship.split(':')
    if (organisationId === orgId) {
      return sbi
    }
  }

  return null
}

export { getSbiFromRelationships }
