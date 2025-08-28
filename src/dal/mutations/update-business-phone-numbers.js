export const updateBusinessPhoneNumbersMutation = `
  mutation Mutation($input: UpdateBusinessPhoneNumbersInput!) {
    updateBusinessPhoneNumbers(input: $input) {
      business {
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
