export const userPermissionsQuery = `
query userPermissions($sbi: ID!, $crn: ID!) {
  business(sbi: $sbi) {
    customer(crn: $crn) {
      permissionGroups {
        id
        level
        functions
      }
      personId 
      role
      firstName
      lastName
    }
  }
}`
// do we need the personId, role,  etc?
