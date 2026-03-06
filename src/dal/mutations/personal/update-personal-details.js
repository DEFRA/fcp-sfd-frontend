export const updatePersonalDetailsMutation = `
  mutation Mutation($allFieldsInput: UpdateCustomerAllFieldsInput!) {
    updateCustomerAllFields(input: $allFieldsInput) {
      success
      customer {
        info {
          name {
            first
            middle
            last
          }
          dateOfBirth
          phone {
            mobile
            landline
          }
          email {
            address
          }
          address {
            line1
            line2
            line3
            line4
            line5
            buildingNumberRange
            buildingName
            flatName
            street
            city
            county
            postalCode
            country
            uprn
          }
        }
      }
    }
  }
`
