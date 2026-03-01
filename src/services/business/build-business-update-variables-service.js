/**
 * Builds the mutation variables for updating a user's business details
 * based only on the sections that actually need updating.
 *
 * @module buildBusinessUpdateVariablesService
 */

const buildBusinessUpdateVariablesService = (businessDetails) => {
  const { orderedSectionsToFix, info } = businessDetails
  const { sbi } = info

  const variables = {}

  if (orderedSectionsToFix.includes('name') && businessDetails.changeBusinessName) {
    variables.updateBusinessNameInput = buildNameInput(sbi, businessDetails)
  }

  if (orderedSectionsToFix.includes('email') && businessDetails.changeBusinessEmail) {
    variables.updateBusinessEmailInput = buildEmailInput(sbi, businessDetails)
  }

  if (orderedSectionsToFix.includes('phone') && businessDetails.changeBusinessPhoneNumbers) {
    variables.updateBusinessPhoneInput = buildPhoneInput(sbi, businessDetails)
  }

  if (orderedSectionsToFix.includes('vat') && businessDetails.changeBusinessVat !== null) {
    variables.updateBusinessVATInput = buildVatInput(sbi, businessDetails)
  }

  if (orderedSectionsToFix.includes('address') && businessDetails.changeBusinessAddress) {
    variables.updateBusinessAddressInput = buildAddressInput(sbi, businessDetails)
  }

  return variables
}

const nullIfUndefined = (value) => value ?? null

const buildAddressInput = (sbi, businessDetails) => {
  const change = businessDetails.changeBusinessAddress

  return {
    sbi,
    address: {
      withoutUprn: buildManualAddress(change)
    }
  }
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
  return {
    sbi,
    vat: businessDetails.changeBusinessVat.vatNumber ?? ''
  }
}

/** Build phone input */
const buildPhoneInput = (sbi, businessDetails) => {
  const changedPhone = businessDetails.changeBusinessPhoneNumbers

  return {
    sbi,
    phone: {
      landline: changedPhone.businessTelephone ?? null,
      mobile: changedPhone.businessMobile ?? null
    }
  }
}

const buildEmailInput = (sbi, businessDetails) => {
  return {
    sbi,
    email: {
      address: businessDetails.changeBusinessEmail.businessEmail
    }
  }
}

const buildNameInput = (sbi, businessDetails) => {
  return {
    sbi,
    name: businessDetails.changeBusinessName.businessName
  }
}

export {
  buildBusinessUpdateVariablesService
}
