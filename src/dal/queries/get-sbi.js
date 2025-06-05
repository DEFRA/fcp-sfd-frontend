export const getSbi = `
  query Business($sbi: ID!) {
    business(sbi: $sbi) {
      sbi
  }
}
`