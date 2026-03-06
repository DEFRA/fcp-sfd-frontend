/**
 * Builds mutation variables for updating a user's personal details.
 * Only includes the sections that actually need updating, using the
 * unified `allFieldsInput` format for the GraphQL mutation.
 *
 * @module buildPersonalUpdateVariablesService
 */

const buildPersonalUpdateVariablesService = (personalDetails) => {
  const { orderedSectionsToFix, crn } = personalDetails

  const allFieldsInput = { crn }

  // Conditionally merge each section into allFieldsInput if its been updated by the user
  if (orderedSectionsToFix.includes('name') && personalDetails.changePersonalName) {
    Object.assign(allFieldsInput, buildNameInput(personalDetails.changePersonalName))
  }

  if (orderedSectionsToFix.includes('email') && personalDetails.changePersonalEmail) {
    Object.assign(allFieldsInput, buildEmailInput(personalDetails.changePersonalEmail))
  }

  if (orderedSectionsToFix.includes('phone') && personalDetails.changePersonalPhoneNumbers) {
    Object.assign(allFieldsInput, buildPhoneInput(personalDetails.changePersonalPhoneNumbers))
  }

  if (orderedSectionsToFix.includes('dob') && personalDetails.changePersonalDob) {
    Object.assign(allFieldsInput, buildDobInput(personalDetails.changePersonalDob))
  }

  if (orderedSectionsToFix.includes('address') && personalDetails.changePersonalAddress) {
    Object.assign(allFieldsInput, buildAddressInput(personalDetails.changePersonalAddress))
  }

  return { allFieldsInput }
}

const buildPhoneInput = (change) => {
  return {
    phone: {
      landline: change.personalTelephone ?? null,
      mobile: change.personalMobile ?? null
    }
  }
}

const buildEmailInput = (change) => {
  return {
    email: {
      address: change.personalEmail
    }
  }
}

const buildNameInput = (change) => {
  return {
    first: change.first,
    middle: change.middle ?? null,
    last: change.last
  }
}

const buildDobInput = (change) => {
  const { day, month, year } = change

  return {
    dateOfBirth: `${year}-${month}-${day}`
  }
}

const buildAddressInput = (change) => {
  return {
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
