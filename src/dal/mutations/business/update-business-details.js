export const businessMutationSectionMap = {
  name: `
    updateBusinessName(input: $updateBusinessNameInput) {
      business {
        info {
          name
        }
      }
      success
    }
  `,

  email: `
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
  `,

  address: `
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
  `,

  phone: `
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
  `,

  vat: `
    updateBusinessVAT(input: $updateBusinessVATInput) {
      business {
        info {
          vat
        }
      }
      success
    }
  `
}

export const businessVariableTypeMap = {
  name: '$updateBusinessNameInput: UpdateBusinessNameInput!',
  email: '$updateBusinessEmailInput: UpdateBusinessEmailInput!',
  address: '$updateBusinessAddressInput: UpdateBusinessAddressInput!',
  phone: '$updateBusinessPhoneInput: UpdateBusinessPhoneInput!',
  vat: '$updateBusinessVATInput: UpdateBusinessVATInput!'
}
