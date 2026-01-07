const personalDetailsMapped = () => ({
  crn: '123456890',
  info: {
    userName: 'John Doe',
    fullName: {
      first: 'John',
      last: 'Doe',
      middle: 'M'
    },
    fullNameJoined: 'John M Doe',
    dateOfBirth: '1990-01-01'
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
})

export {
  personalDetailsMapped
}
