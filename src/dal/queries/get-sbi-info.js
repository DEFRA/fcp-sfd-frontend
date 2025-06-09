export const getSbiInfo = `
  query Business($sbi: ID!) {
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
