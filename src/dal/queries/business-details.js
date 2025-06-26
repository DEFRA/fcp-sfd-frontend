export const businessDetailsQuery = `
 query Business($sbi: ID!, $crn: ID!) {
  business(sbi: $sbi) {
    organisationId
    sbi
    info {
      name
      vat
      traderNumber
      vendorNumber
      legalStatus {
        code
        type
      }
      type {
        code
        type
      }
      address {
        buildingNumberRange
        buildingName
        flatName
        street
        city
        county
        postalCode
        country
        dependentLocality
        doubleDependentLocality
      }
      email {
        address
      }
      phone {
        mobile
        landline
      }
    }
  }
  customer(crn: $crn) {
    info {
      name {
        first
        last
        title
      }
    }
  }
}

`
