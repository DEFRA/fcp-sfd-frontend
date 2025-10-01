export const updatePersonalPhoneNumbersMutation = `
  mutation Mutation($input: UpdateCustomerPhoneInput!) {
    updateCustomerPhone(input: $input) {
      customer {
        info {
          phone {
            landline
            mobile
          }
        }
      }
    }
  }
`
