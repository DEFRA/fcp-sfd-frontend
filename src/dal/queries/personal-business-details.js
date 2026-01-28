export const personalBusinessDetailsQuery = `
  query Name($crn: ID!, $sbi: ID!) {
    customer(crn: $crn) {
      info {
        name {
          first
          last
          middle
        }
      }
    }
    business(sbi: $sbi) {
      organisationId
      sbi
      info {
        name
      }
    }
  }
`
