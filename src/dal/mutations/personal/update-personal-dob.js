export const updatePersonalDobMutation = `
mutation UpdateCustomerDateOfBirth($input: UpdateCustomerDateOfBirthInput!) {
  updateCustomerDateOfBirth(input: $input) {
    customer {
      info {
        dateOfBirth
      }
    }
  }
}
`
