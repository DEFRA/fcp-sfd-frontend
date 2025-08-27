export const updateBusinessVATMutation = `
  mutation Mutation($input: UpdateBusinessVATInput!) {
    updateBusinessVAT(input: $input) {
      business {
        info {
          vatNumber
        }
      }
      success
    }
  }
`
