export const updatePersonalDetailsMutation = `
mutation Mutation($updateCustomerNameInput: UpdateCustomerNameInput!, $updateCustomerEmailInput: UpdateCustomerEmailInput!, $updateCustomerPhoneInput: UpdateCustomerPhoneInput!, $updateCustomerDateOfBirthInput: UpdateCustomerDateOfBirthInput!, $updateCustomerAddressInput: UpdateCustomerAddressInput!) {
  updateCustomerName(input: $updateCustomerNameInput) {
    customer {
      info {
        name {
          first
          last
          middle
        }
      }
    }
  }
  updateCustomerEmail(input: $updateCustomerEmailInput) {
    customer {
      info {
        email {
          address
        }
      }
    }
  }
  updateCustomerPhone(input: $updateCustomerPhoneInput) {
    customer {
      info {
        phone {
          landline
          mobile
        }
      }
    }
  }
  updateCustomerDateOfBirth(input: $updateCustomerDateOfBirthInput) {
    customer {
      info {
        dateOfBirth
      }
    }
  }
  updateCustomerAddress(input: $updateCustomerAddressInput) {
    customer {
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
}
`
