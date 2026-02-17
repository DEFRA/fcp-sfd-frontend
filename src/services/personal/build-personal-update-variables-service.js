/**
 * Builds the mutation variables for updating a user's personal details
 * based on their existing data and any submitted changes.
 *
 * @module buildPersonalUpdateVariablesService
 */

const buildPersonalUpdateVariables = (personalDetails) => {
  const { crn } = personalDetails

  return {
    updateCustomerNameInput: buildNameInput(crn, personalDetails),
    updateCustomerEmailInput: buildEmailInput(crn, personalDetails),
    updateCustomerPhoneInput: buildPhoneInput(crn, personalDetails),
    updateCustomerDateOfBirthInput: buildDobInput(crn, personalDetails),
    updateCustomerAddressInput: buildAddressInput(crn, personalDetails)
  }
}

const buildAddressInput = (crn, personalDetails) => {
  let address = formatExistingAddress(personalDetails.address)

  if (personalDetails.changePersonalAddress) {
    address = formatManualAddressInput(personalDetails.changePersonalAddress)
  }

  return {
    crn,
    address
  }
}

const buildPhoneInput = (crn, personalDetails) => {
  const baseContact = personalDetails.contact
  const changedPhone = personalDetails.changePersonalPhoneNumbers

  let landline = baseContact?.telephone ?? null
  let mobile = baseContact?.mobile ?? null

  if (changedPhone) {
    landline = changedPhone.personalTelephone ?? null
    mobile = changedPhone.personalMobile ?? null
  }

  return {
    crn,
    phone: {
      landline,
      mobile
    }
  }
}

const buildEmailInput = (crn, personalDetails) => {
  let emailAddress = personalDetails.contact?.email

  if (personalDetails.changePersonalEmail) {
    emailAddress = personalDetails.changePersonalEmail.personalEmail
  }

  return {
    crn,
    email: {
      address: emailAddress
    }
  }
}

const buildNameInput = (crn, personalDetails) => {
  const baseName = personalDetails.info.fullName
  const changedName = personalDetails.changePersonalName

  let first = baseName.first
  let middle = baseName.middle ?? null
  let last = baseName.last

  if (changedName) {
    first = changedName.first
    middle = changedName.middle ?? null
    last = changedName.last
  }

  return {
    crn,
    first,
    middle,
    last
  }
}

const buildDobInput = (crn, personalDetails) => {
  let dob = personalDetails.info.dateOfBirth.full

  if (personalDetails.changePersonalDob) {
    const { day, month, year } = personalDetails.changePersonalDob
    dob = `${year}-${month}-${day}`
  }

  return {
    crn,
    dateOfBirth: dob
  }
}

const formatExistingAddress = (address) => {
  if (address.lookup?.uprn) {
    const { lookup } = address

    return {
      buildingNumberRange: lookup.buildingNumberRange ?? null,
      buildingName: lookup.buildingName ?? null,
      flatName: lookup.flatName ?? null,
      street: lookup.street ?? null,
      city: lookup.city ?? null,
      county: lookup.county ?? null,
      postalCode: address.postcode ?? null,
      country: address.country ?? null,
      dependentLocality: lookup.dependentLocality ?? null,
      doubleDependentLocality: lookup.doubleDependentLocality ?? null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      line5: null,
      uprn: lookup.uprn
    }
  }

  return {
    buildingNumberRange: null,
    buildingName: null,
    flatName: null,
    street: null,
    doubleDependentLocality: null,
    dependentLocality: null,
    city: address.manual.line4,
    county: address.manual.line5 ?? null,
    postalCode: address.postcode,
    country: address.country,
    line1: address.manual.line1,
    line2: address.manual.line2 ?? null,
    line3: address.manual.line3 ?? null,
    line4: address.manual.line4 ?? null,
    line5: address.manual.line5 ?? null,
    uprn: null
  }
}

const formatManualAddressInput = (address) => {
  return {
    buildingNumberRange: null,
    buildingName: null,
    flatName: null,
    street: null,
    city: address.city,
    county: address.county ?? null,
    postalCode: address.postcode,
    country: address.country,
    line1: address.address1,
    line2: address.address2 ?? null,
    line3: address.address3 ?? null,
    line4: address.city,
    line5: address.county ?? null,
    uprn: null
  }
}

export {
  buildPersonalUpdateVariables
}
