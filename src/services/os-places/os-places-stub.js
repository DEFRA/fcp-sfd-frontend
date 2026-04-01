import { mockAddresses } from '../../mock-data/mock-os-places-addresses.js'

/**
 * Retrieves mock address data matching a given postcode.
 *
 * This function is used when OS Places API stubbing is enabled.
 * It takes a postcode, formats it to uppercase, and removes all spaces.
 * It then filters the mock address dataset to find all addresses whose
 * postcodes (also normalized by removing spaces and converting to uppercase)
 * match the given postcode.
 *
 * @param {string} postcode - The postcode to search for.
 * @returns {{ features: Array<Object> }} An object containing a `features` array of matching addresses.
 */
export const mockPostcode = (postcode) => {
  const formattedPostcode = postcode?.toUpperCase().replaceAll(' ', '')

  // Find addresses that match the formatted postcode (ignoring spaces)
  const matchingAddresses = mockAddresses.filter(address => {
    const addressPostcode = address.properties.POSTCODE?.toUpperCase().replaceAll(' ', '')

    return addressPostcode === formattedPostcode
  })

  return {
    features: matchingAddresses
  }
}
