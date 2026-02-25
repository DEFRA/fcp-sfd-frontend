/**
 * Stub personal details returned when the DAL connection is disabled
 * (e.g. local development or feature flag off). Matches the shape produced by
 * mapPersonalDetails from the DAL response.
 *
 * @module mockPersonalDetails
 */

/** Raw personal details shape as returned by the DAL API (used by tests and mapper). */
const dalData = {
  customer: {
    crn: '123456890',
    info: {
      name: {
        first: 'John',
        middle: 'M',
        last: 'Doe'
      },
      dateOfBirth: '1990-01-01',
      phone: {
        landline: '01234567890',
        mobile: null
      },
      email: {
        address: 'test@example.com'
      },
      address: {
        flatName: 'THE COACH HOUSE',
        buildingName: 'STOCKWELL HALL',
        buildingNumberRange: '7',
        street: 'HAREWOOD AVENUE',
        city: 'DARLINGTON',
        county: 'Dorset',
        line1: '76 Robinswood Road',
        line2: 'UPPER CHUTE',
        line3: 'Child Okeford',
        line4: null,
        line5: null,
        postalCode: 'CO9 3LS',
        country: 'United Kingdom',
        uprn: '12345'
      }
    }
  }
}

/** Personal details in app-friendly shape (mapPersonalDetails output); returned when DAL is disabled. */
const mappedData = {
  crn: '123456890',
  info: {
    userName: 'John Doe',
    fullNameJoined: 'John M Doe',
    fullName: {
      first: 'John',
      last: 'Doe',
      middle: 'M'
    },
    dateOfBirth: {
      full: '1990-01-01',
      day: '01',
      month: '01',
      year: '1990'
    }
  },
  address: {
    lookup: {
      flatName: 'THE COACH HOUSE',
      buildingName: 'STOCKWELL HALL',
      buildingNumberRange: '7',
      street: 'HAREWOOD AVENUE',
      city: 'DARLINGTON',
      county: 'Dorset',
      uprn: '12345'
    },
    manual: {
      line1: '76 Robinswood Road',
      line2: 'UPPER CHUTE',
      line3: 'Child Okeford',
      line4: null,
      line5: null
    },
    postcode: 'CO9 3LS',
    country: 'United Kingdom'
  },
  contact: {
    email: 'test@example.com',
    telephone: '01234567890',
    mobile: null
  },
  business: {
    info: {
      name: 'Acme Farms Ltd'
    }
  }
}

export {
  dalData,
  mappedData
}
