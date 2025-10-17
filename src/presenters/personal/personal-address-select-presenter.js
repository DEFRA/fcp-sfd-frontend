/**
 * Formats data ready for presenting in the `/account-address-select` page
 * @module personalAddressSelectPresenter
 */

const personalAddressSelectPresenter = (data) => {
  return {
    backLink: { href: '/account-address-change' },
    pageTitle: 'Choose your personal address',
    metaDescription: 'Choose the address for your personal account.',
    userName: data.info.fullName.fullNameJoined ?? null,
    postcode: data.changePersonalPostcode.postcode,
    displayAddresses: formatDisplayAddresses(data.changePersonalAddresses, data.changePersonalAddress)
  }
}

/**
 * Formats a list of address objects for display in a dropdown menu.
 *
 * Each address is transformed into an option with:
 * - `value`: a concatenation of the address UPRN and displayAddress
 * - `text`: the displayAddress property from the address object. This is a fully
 *   formatted address string, e.g. "123 Main Street, Manchester, M1 1AA"
 * - `selected`: true only if it matches the previously picked address; otherwise false
 *
 * A summary option is also prepended to the start of the list,
 * showing how many addresses were found. This summary option is
 * marked as selected by default unless a previously picked address exists,
 * in which case only that matching address will be selected.
 *
 * Note: the `value` is constructed by concatenating `uprn` and `displayAddress`
 * because during testing some addresses were found to share the same UPRN (although rare).
 * Postcode LL55 2NF in particular had a few.
 * Using the UPRN alone as the identifying value caused the wrong address to be returned.
 * Concatenating the UPRN with the full display address ensures the dropdown option value is unique for each entry.
 */
function formatDisplayAddresses (addresses, previouslyPickedAddress) {
  const displayAddresses = addresses.map(address => ({
    value: `${address.uprn}${address.displayAddress}`,
    text: address.displayAddress,
    selected:
      previouslyPickedAddress?.uprn === address.uprn &&
      previouslyPickedAddress?.displayAddress === address.displayAddress
  }))

  // Check if any address is already selected
  const hasSelectedAddress = displayAddresses.some(addr => addr.selected)

  // Add a display summary option to the beginning of the list
  // e.g. "18 addresses found"
  const text = addresses.length === 1 ? '1 address found' : `${addresses.length} addresses found`

  displayAddresses.unshift({
    value: 'display',
    text,
    selected: !hasSelectedAddress
  })

  return displayAddresses
}

export {
  personalAddressSelectPresenter
}
