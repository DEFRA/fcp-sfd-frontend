/**
 * @module updatePersonalFixCheckService
 */

import { fetchPersonalFixListService } from './fetch-personal-fix-list-service.js'
import moment from 'moment'
import { updatePersonalDetailsMutation } from '../../dal/mutations/personal/update-personal-details.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updatePersonalFixCheckService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalFixListService(yar, credentials)

  let dob
  if (personalDetails.changePersonalDOB) {
    const { day, month, year } = personalDetails.changePersonalDOB
    dob = moment(new Date([`${month}/${day}/${year}`])).format('D MMMM YYYY')
  } else {
    dob = personalDetails.info.dateOfBirth
  }

  const changedName = personalDetails.changePersonalName
  const changedPhoned = personalDetails.changePersonalPhoneNumbers
  const changedAddress = personalDetails.changePersonalAddress
  const { crn, info, contact, address: currentAddress } = personalDetails

  let first = info.fullName.first
  let middle = info.fullName.middle ?? null
  let last = info.fullName.last
  let telephone = contact.telephone
  let mobile = contact.mobile

  if (changedName) {
    first = changedName.first
    middle = changedName.middle ?? null
    last = changedName.last
  }


  if (changedPhoned) {
    telephone = changedPhoned.personalTelephone ?? null
    mobile = changedPhoned.personalMobile ?? null
  }

  let address = formatAddress(currentAddress)

  if (changedAddress) {
    address = {
      buildingNumberRange: null,
      buildingName: null,
      flatName: null,
      street: null,
      city: changedAddress.city, // required for DAL/v1
      county: changedAddress.county ?? null,
      postalCode: changedAddress.postcode, // required for DAL/v1
      country: changedAddress.country, // required for DAL/v1
      line1: changedAddress.address1, // required for DAL/v1
      line2: changedAddress.address2 ?? null,
      line3: changedAddress.address3 ?? null,
      line4: changedAddress.city ?? null, // manual city mapped for validation
      line5: changedAddress.county ?? null,
      uprn: null
    }
  }

  const variables = {
    // updateCustomerName
    updateCustomerNameInput: {
      crn,
      first: first,
      last: last,
      middle: middle
    },

    // updateCustomerEmail
    updateCustomerEmailInput: {
      crn,
      email: {
        address:
          personalDetails.changePersonalEmail?.personalEmail ??
          info.email.address
      }
    },

    // updateCustomerPhone
    updateCustomerPhoneInput: {
      crn,
      phone: {
        landline: telephone,
        mobile: mobile
      }
    },

    // updateCustomerDateOfBirth
    updateCustomerDateOfBirthInput: {
      crn,
      dateOfBirth: dob
    },

    // updateCustomerAddress
    updateCustomerAddressInput: {
      crn,
      address: address
    }
  }

  await updateDalService(updatePersonalDetailsMutation, variables)
  yar.clear('personalDetails')

  flashNotification(yar, 'Success', buildSuccessMessage(personalDetails))
}

const buildSuccessMessage = (personalDetails) => {
  const changes = []

  if (personalDetails.changePersonalName) {
    changes.push('full name')
  }

  if (personalDetails.changePersonalEmail) {
    changes.push('personal email address')
  }

  if (personalDetails.changePersonalPhoneNumbers) {
    changes.push('personal phone numbers')
  }

  if (personalDetails.changePersonalDOB) {
    changes.push('date of birth')
  }

  if (personalDetails.changePersonalAddress) {
    changes.push('personal address')
  }

  if (changes.length === 1) {
    return `You have updated your ${changes[0]}`
  }

  return changes.length === 1 ? `You have updated your ${changes[0]}` : changes
}

const formatAddress = (address) => {
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
      uprn: address.uprn // required for DAL/v1
    }
  }

  return {
      buildingNumberRange: null,
      buildingName: null,
      flatName: null,
      street: null,
      city: address.city, // required for DAL/v1
      county: address.county ?? null,
      postalCode: address.postcode, // required for DAL/v1
      country: address.country, // required for DAL/v1
      line1: address.address1, // required for DAL/v1
      line2: address.address2 ?? null,
      line3: address.address3 ?? null,
      line4: address.city ?? null, // manual city mapped for validation
      line5: address.county ?? null,
      uprn: null
    }
}

export {
  updatePersonalFixCheckService
}
