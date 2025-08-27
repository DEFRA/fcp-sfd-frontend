export const updateBusinessPhoneMutation = `
  mutation UpdateBusinessPhone($input: UpdateBusinessPhoneInput!) {
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
