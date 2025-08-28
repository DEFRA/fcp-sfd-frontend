export const updateBusinessPhoneMutation = `
  mutation Mutation($input: UpdateBusinessPhoneInput!) {
    updateBusinessPhone(input: $input) {
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
