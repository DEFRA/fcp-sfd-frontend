/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessDetailsService
 */

const fetchBusinessPhoneNumbersService = async (_request) => {
  // Refactor: Remove stubbed data and instead call the API to get the business details associated with the users log in
  // This will be using the consolidated view API
  return {
    businessTelephone: '0118 999 881 999 119 725 3',
    businessMobile: '0118 999 881 999 119 725 3',
  }
}

export {
  fetchBusinessPhoneNumbersService
}
