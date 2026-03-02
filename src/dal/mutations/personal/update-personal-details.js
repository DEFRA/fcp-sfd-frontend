export const personalMutationSectionMap = {
  name: `
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
  `,

  email: `
    updateCustomerEmail(input: $updateCustomerEmailInput) {
      customer {
        info {
          email {
            address
          }
        }
      }
    }
  `,

  address: `
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
  `,

  phone: `
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
  `,

  dateOfBirth: `
    updateCustomerDateOfBirth(input: $updateCustomerDateOfBirthInput) {
      customer {
        info {
          dateOfBirth
        }
      }
    }
  `
}

export const personalVariableTypeMap = {
  name: '$updateCustomerNameInput: UpdateCustomerNameInput!',
  email: '$updateCustomerEmailInput: UpdateCustomerEmailInput!',
  address: '$updateCustomerAddressInput: UpdateCustomerAddressInput!',
  phone: '$updateCustomerPhoneInput: UpdateCustomerPhoneInput!',
  dateOfBirth: '$updateCustomerDateOfBirthInput: UpdateCustomerDateOfBirthInput!'
}
