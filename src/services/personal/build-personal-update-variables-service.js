/**
 * Builds mutation variables for updating a user's personal details
 * based only on the sections that actually need updating.
 *
 * @module buildPersonalUpdateVariablesService
 */

const buildPersonalUpdateVariablesService = (personalDetails) => {
  const { orderedSectionsToFix, crn } = personalDetails

  const variables = {}

  if (orderedSectionsToFix.includes('name') && personalDetails.changePersonalName) {
    variables.updateCustomerNameInput = buildNameInput(crn, personalDetails.changePersonalName)
  }

  if (orderedSectionsToFix.includes('email') && personalDetails.changePersonalEmail) {
    variables.updateCustomerEmailInput = buildEmailInput(crn, personalDetails.changePersonalEmail)
  }

  if (orderedSectionsToFix.includes('phone') && personalDetails.changePersonalPhoneNumbers) {
    variables.updateCustomerPhoneInput = buildPhoneInput(crn, personalDetails.changePersonalPhoneNumbers)
  }

  if (orderedSectionsToFix.includes('dob') && personalDetails.changePersonalDob) {
    variables.updateCustomerDateOfBirthInput = buildDobInput(crn, personalDetails.changePersonalDob)
  }

  if (orderedSectionsToFix.includes('address') && personalDetails.changePersonalAddress) {
    variables.updateCustomerAddressInput = buildAddressInput(crn, personalDetails.changePersonalAddress)
  }

  return variables
}

const buildPhoneInput = (crn, change) => {
  return {
    crn,
    phone: {
      landline: change.personalTelephone ?? null,
      mobile: change.personalMobile ?? null
    }
  }
}

const buildEmailInput = (crn, change) => {
  return {
    crn,
    email: {
      address: change.personalEmail
    }
  }
}

const buildNameInput = (crn, change) => {
  return {
    crn,
    first: change.first,
    middle: change.middle ?? null,
    last: change.last
  }
}

const buildDobInput = (crn, change) => {
  const { day, month, year } = change

  return {
    crn,
    dateOfBirth: `${year}-${month}-${day}`
  }
}

const buildAddressInput = (crn, change) => {
  return {
    crn,
    address: {
      buildingNumberRange: null,
      buildingName: null,
      flatName: null,
      street: null,
      city: change.city,
      county: change.county ?? null,
      postalCode: change.postcode,
      country: change.country,
      line1: change.address1,
      line2: change.address2 ?? null,
      line3: change.address3 ?? null,
      line4: change.city,
      line5: change.county ?? null,
      uprn: null
    }
  }
}

export {
  buildPersonalUpdateVariablesService
}
