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
