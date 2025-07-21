const dalPersonalData = {
  personal: {
    organisationId: '5565448',
    sbi: '107183280',
    fullName: {
      first: 'Ingrid',
      middle: 'frederick',
      last: 'Cook'
    },
    dateOfBirth: '1980-01-01',
    info: {
      address: {
        buildingNumberRange: '7',
        buildingName: 'STOCKWELL HALL',
        flatName: 'THE COACH HOUSE',
        street: 'HAREWOOD AVENUE',
        city: 'DARLINGTON',
        county: 'Dorset',
        postalCode: 'CO9 3LS',
        country: 'United Kingdom',
        dependentLocality: 'ELLICOMBE',
        doubleDependentLocality: 'WOODTHORPE',
        line1: '76 Robinswood Road',
        line2: 'UPPER CHUTE',
        line3: 'Child Okeford',
        line4: null,
        line5: null
      },
      email: { address: 'henleyrej@eryelnehk.com.test' },
      phone: { mobile: null, landline: '01234031859' }
    }
  }
}

const mappedData = {
  crn: '123456890',
  contact: {
    telephone: '01234567890',
    mobile: null,
    email: 'test@example.com'
  },
  customer: {
    fullName: 'John M Doe'
  },
  info: {
    fullName: {
      first: 'John',
      middle: 'M',
      last: 'Doe'
    },
    dateOfBirth: '1990-01-01'
  },
  address: {
    lookup: {
      flatName: 'THE COACH HOUSE',
      buildingName: 'STOCKWELL HALL',
      buildingNumberRange: '7',
      street: 'HAREWOOD AVENUE',
      city: 'DARLINGTON',
      county: 'Dorset'
    },
    manual: {
      addressLine1: '76 Robinswood Road',
      addressLine2: 'UPPER CHUTE',
      addressLine3: 'Child Okeford'
    },
    postcode: 'CO9 3LS',
    country: 'United Kingdom'
  }
}

export {
  dalPersonalData,
  mappedData
}
