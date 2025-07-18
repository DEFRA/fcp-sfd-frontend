const dalData = {
  customer: {
    crn: '9477368292',
    info: {
      name: {
        title: 'Mrs.',
        first: 'Ingrid',
        middle: 'Jerimire',
        last: 'Klaufichious Limouhetta Mortimious Neuekind Orpheus Perimillian Quixillotrio Reviticlese Cook'
      },
      address: {
        buildingNumberRange: '7',
        buildingName: 'STOCKWELL HALL',
        flatName: 'THE COACH HOUSE',
        street: 'HAREWOOD AVENUE',
        city: 'DARLINGTON',
        county: 'Dorset',
        postalCode: 'CO9 3LS',
        country: 'United Kingdom'
      },
      phone: {
        landline: '01234031859',
        mobile: null
      },
      dateOfBirth: '1980-01-01',
      email: {
        address: 'email@test.com'
      }
    }
  }
}

const mappedData = {
  crn: '9477368292',
  info: {
    fullName: 'Mrs. Ingrid Jerimire Klaufichious Limouhetta Mortimious Neuekind Orpheus Perimillian Quixillotrio Reviticlese Cook',
    dateOfBirth: '1980-01-01'
  },
  address: {
    buildingNumberRange: '7',
    buildingName: 'STOCKWELL HALL',
    flatName: 'THE COACH HOUSE',
    street: 'HAREWOOD AVENUE',
    city: 'DARLINGTON',
    county: 'Dorset',
    postalCode: 'CO9 3LS',
    country: 'United Kingdom'
  },
  contact: {
    email: 'henleyrej@eryelnehk.com.test',
    landline: '01234031859',
    mobile: null
  }
}

export {
  dalData,
  mappedData
}
