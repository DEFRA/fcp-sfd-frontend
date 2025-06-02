export const query = `
  query {
    business(sbi: "107591843") {
      customers {
        firstName
        lastName
      }
    }
  }
`
