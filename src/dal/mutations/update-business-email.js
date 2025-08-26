export const updateBusinessEmailMutation = `
  mutation Mutation($input: UpdateBusinessEmailInput!) {
    updateBusinessEmail(input: $input) {
      business {
        info {
          email {
            address
          }
        }
      }
      success
    }
  }
`

// there is a validated variable (presumed to be a boolean) that we may want to use e.g.
// updateBusinessEmailMutation = `
//   mutation Mutation($input: UpdateBusinessEmailInput!) {
//     updateBusinessEmail(input: $input) {
//       business {
//         info {
//           email {
//             address
//             validated
//           }
//         }
//       }
//       success
//     }
//   }
// `
