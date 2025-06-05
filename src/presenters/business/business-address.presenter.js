// Wrap this in businessAddressPresenter?
const presentAddressForCheckView = (data, yar) => {
  return {
    address1: data.address1 ?? null, // should i be using nulls or ''?
    address2: data.address2 ?? null,
    addressCity: data.addressCity ?? null,
    addressCounty: data.addressCounty ?? null,
    addressPostcode: data.addressPostcode ?? null,
    addressCountry: data.addressCountry ?? null
  }
}

const presentAddressForEntryView = (data, yar) => {
  return {
    address1: data.address1 ?? null,
    address2: data.address2 ?? null,
    addressCity: data.addressCity ?? null,
    addressCounty: data.addressCounty ?? null,
    addressPostcode: data.addressPostcode ?? null,
    addressCountry: data.addressCountry ?? null
  }
}

export {
  presentAddressForCheckView,
  presentAddressForEntryView
}
