export const queryBuilder = (queryName, queryPK, body) => {
  return `
  query {
    ${queryName}(${queryPK}) {
      ${body}
    }
  }
`
}
