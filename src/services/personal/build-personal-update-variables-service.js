/**
 * Builds the mutation variables for updating a user's personal details
 * based on their existing data and any submitted changes.
 *
 * @module buildPersonalUpdateVariablesService
 */

import moment from 'moment'

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
  let dob = personalDetails.info.dateOfBirth

  if (personalDetails.changePersonalDob) {
    const { day, month, year } = personalDetails.changePersonalDob
    dob = new Date(`${month}/${day}/${year}`)
  }

  return {
    crn,
    dateOfBirth: moment(dob).locale('en-ca').format('L')
  }
}

const formatExistingAddress = (address) => {
  if (address.uprn) {
    return {
      buildingNumberRange: address.buildingNumberRange ?? null,
      buildingName: address.buildingName ?? null,
      flatName: address.flatName ?? null,
      street: address.street ?? null,
      city: address.city ?? null,
      county: address.county ?? null,
      postalCode: address.postcode ?? null,
      country: address.country ?? null,
      dependentLocality: address.dependentLocality ?? null,
      doubleDependentLocality: address.doubleDependentLocality ?? null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      line5: null,
      uprn: address.uprn
    }
  }

  return formatManualAddressInput(address)
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
