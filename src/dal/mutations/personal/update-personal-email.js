export const updatePersonalEmailMutation = `
  mutation Mutation($input: UpdateCustomerEmailInput!) {
    updateCustomerEmail(input: $input) {
      customer {
        info {
          email {
            address
          }
        }
      }
    }
  }
`
