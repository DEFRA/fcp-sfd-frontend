export const updatePersonalAddressMutation = `
  mutation Mutation($input: UpdateCustomerAddressInput!) {
    updateCustomerAddress(input: $input) {
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
