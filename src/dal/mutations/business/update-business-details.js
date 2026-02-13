export const updateBusinessDetailsMutation = `
mutation Mutation ($updateBusinessAddressInput: UpdateBusinessAddressInput!, $updateBusinessEmailInput: UpdateBusinessEmailInput!, $updateBusinessNameInput: UpdateBusinessNameInput!, $updateBusinessPhoneInput: UpdateBusinessPhoneInput!, $updateBusinessVATInput: UpdateBusinessVATInput!) {
  updateBusinessAddress(input: $updateBusinessAddressInput) {
    business {
      info {
        address {
          line1
          line2
          line3
          line4
          line5
          postalCode
          country
          city
          buildingNumberRange
          buildingName
          flatName
          street
          county
          uprn
        }
      }
    }
  }
  updateBusinessEmail(input: $updateBusinessEmailInput) {
    business {
      info {
        email {
          address
        }
      }
    }
    success
  }
  updateBusinessName(input: $updateBusinessNameInput) {
    business {
      info {
        name
      }
    }
    success
  }
  updateBusinessPhone(input: $updateBusinessPhoneInput) {
    business {
      info {
        phone {
          landline
          mobile
        }
      }
    }
  }
  updateBusinessVAT(input: $updateBusinessVATInput) {
    business {
      info {
        vat
      }
    }
    success
  }
}
`
