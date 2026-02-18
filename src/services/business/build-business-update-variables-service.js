/**
 * Builds the mutation variables for updating a user's business details
 * based on their existing data and any submitted changes.
 *
 * @module buildBusinessUpdateVariablesService
 */

const buildBusinessUpdateVariables = (businessDetails) => {
  const { sbi } = businessDetails.info

  return {
    updateBusinessNameInput: buildNameInput(sbi, businessDetails),
    updateBusinessEmailInput: buildEmailInput(sbi, businessDetails),
    updateBusinessPhoneInput: buildPhoneInput(sbi, businessDetails),
    updateBusinessVATInput: buildVatInput(sbi, businessDetails),
    updateBusinessAddressInput: buildAddressInput(sbi, businessDetails)
  }
}

const nullIfUndefined = (value) => value ?? null

const buildAddressInput = (sbi, businessDetails) => {
  const change = businessDetails.changeBusinessAddress
  const existing = businessDetails.address

  const baseVariables = {
    sbi,
    address: {}
  }

  // If the user has changed the address, it will ALWAYS be manual
  if (change) {
    baseVariables.address.withoutUprn = buildManualAddress(change)

    return baseVariables
  }

  // Otherwise fall back to existing address
  if (existing.lookup?.uprn) {
    baseVariables.address.withUprn = formatExistingUprn(existing)
  } else {
    baseVariables.address.withoutUprn = formatExistingManual(existing)
  }

  return baseVariables
}

const buildManualAddress = (change) => ({
  buildingNumberRange: null,
  buildingName: null,
  flatName: null,
  street: null,
  city: change.city,
  county: nullIfUndefined(change.county),
  postalCode: change.postcode,
  country: change.country,
  line1: change.address1,
  line2: nullIfUndefined(change.address2),
  line3: nullIfUndefined(change.address3),
  line4: nullIfUndefined(change.city),
  line5: nullIfUndefined(change.county),
  uprn: null
})

const buildVatInput = (sbi, businessDetails) => {
  let vatNumber = businessDetails.info?.vat

  if (businessDetails.changeBusinessVat) {
    vatNumber = businessDetails.changeBusinessVat.vatNumber
  }

  return {
    sbi,
    vat: vatNumber
  }
}

const buildPhoneInput = (sbi, businessDetails) => {
  const baseContact = businessDetails.contact
  const changedPhone = businessDetails.changeBusinessPhoneNumbers

  let landline = baseContact?.landline ?? null
  let mobile = baseContact?.mobile ?? null

  if (changedPhone) {
    landline = changedPhone.businessTelephone ?? null
    mobile = changedPhone.businessMobile ?? null
  }

  return {
    sbi,
    phone: {
      landline,
      mobile
    }
  }
}

const buildEmailInput = (sbi, businessDetails) => {
  let emailAddress = businessDetails.contact?.email

  if (businessDetails.changeBusinessEmail) {
    emailAddress = businessDetails.changeBusinessEmail.businessEmail
  }

  return {
    sbi,
    email: {
      address: emailAddress
    }
  }
}

const buildNameInput = (sbi, businessDetails) => {
  let businessName = businessDetails.info.businessName

  if (businessDetails.changeBusinessName) {
    businessName = businessDetails.changeBusinessName.businessName
  }

  return {
    sbi,
    name: businessName
  }
}

const formatExistingUprn = (address) => {
  const lookup = address.lookup ?? {}

  return {
    buildingNumberRange: nullIfUndefined(lookup.buildingNumberRange),
    buildingName: nullIfUndefined(lookup.buildingName),
    flatName: nullIfUndefined(lookup.flatName),
    street: nullIfUndefined(lookup.street),
    city: nullIfUndefined(lookup.city),
    county: nullIfUndefined(lookup.county),
    postalCode: nullIfUndefined(address.postcode),
    country: nullIfUndefined(address.country),
    dependentLocality: nullIfUndefined(lookup.dependentLocality),
    doubleDependentLocality: nullIfUndefined(lookup.doubleDependentLocality),
    line1: null,
    line2: null,
    line3: null,
    line4: null,
    line5: null,
    uprn: lookup.uprn
  }
}

const formatExistingManual = (address) => ({
  buildingNumberRange: null,
  buildingName: null,
  flatName: null,
  street: null,
  dependentLocality: null,
  doubleDependentLocality: null,
  city: nullIfUndefined(address.manual?.line4),
  county: nullIfUndefined(address.manual?.line5),
  postalCode: nullIfUndefined(address.postcode),
  country: nullIfUndefined(address.country),
  line1: nullIfUndefined(address.manual?.line1),
  line2: nullIfUndefined(address.manual?.line2),
  line3: nullIfUndefined(address.manual?.line3),
  line4: nullIfUndefined(address.manual?.line4),
  line5: nullIfUndefined(address.manual?.line5),
  uprn: null
})

export {
  buildBusinessUpdateVariables
}
