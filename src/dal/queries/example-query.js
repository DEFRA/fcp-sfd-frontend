export const exampleQuery = `
  query ExampleQuery($sbi: ID!, $crn: ID!) {
    business(sbi: $sbi) {
      sbi
      info {
        name
        email {
          address
        }
        legalStatus {
          type
        }
      }
      customer(crn: $crn) {
        crn
        firstName
        lastName
        role
      }
    }
  }
`
