/**
 * Fetches the business name data associated with the logged in users business
 * @module fetchBusinessNameService
 */

const fetchBusinessNameService = async () => {
  // Refactor: Remove stubbed data and instead call the API to get the business name associated with the users log in
  // The data needed for the business name change page.
  return {
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

export {
  fetchBusinessNameService
}
