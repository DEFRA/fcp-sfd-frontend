/**
 * Formats data ready for presenting in the `/business-address-select-change` page
 * @module businessAddressSelectChangePresenter
 */

const businessAddressSelectChangePresenter = (data) => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Choose your business address',
    metaDescription: 'Choose the address for your business.',
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null,
    postcode: data.changeBusinessPostcode.businessPostcode,
    displayAddresses: displayAddresses(data.changeBusinessAddresses)
  }
}

/**
 * Formats a list of address objects for display in a dropdown menu.
 *
 * Each address is transformed into an option with:
 * - `value`: a concatenation of the address UPRN and displayAddress
 * - `text`: the displayAddress property from the address object. This is a fully
 *   formatted address string, e.g. "123 Main Street, Manchester, M1 1AA"
 * - `selected`: false for all addresses
 *
 * A summary option is also prepended to the start of the list,
 * showing how many addresses were found. This summary option is
 * marked as selected by default.
 *
 * Note: the `value` is constructed by concatenating `uprn` and `displayAddress`
 * because during testing some addresses were found to share the same UPRN (although rare).
 * Postcode LL55 2NF in particular had a few.
 * Using the UPRN alone as the identifying value caused the wrong address to be returned.
 * Concatenating the UPRN with the full display address ensures the dropdown option value is unique for each entry.
 */
function displayAddresses(addresses) {
  const displayAddresses = addresses.map(address => ({
    value: `${address.uprn}${address.displayAddress}`,
    text: address.displayAddress,
    selected: false
  }))

  // Add a display summary option to the beginning of the list
  // e.g. "18 addresses found"
  const text = addresses.length === 1 ? '1 address found' : `${addresses.length} addresses found`

  displayAddresses.unshift({
    value: 'display',
    text,
    selected: true
  })

  return displayAddresses
}

export {
  businessAddressSelectChangePresenter
}
