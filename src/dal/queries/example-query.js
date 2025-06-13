export const exampleQuery = `
  query ExampleQuery($sbi: ID!) {
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
    }
  }
`
