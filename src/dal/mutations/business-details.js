export const businessDetailsMutation = '
'

mutation Mutation($input: UpdateBusinessNameInput!) {
  updateBusinessName(input: $input) {
    business {
      info {
        name
      }
    }
    success
  }
}
