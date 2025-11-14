const dalData = {
  customer: {
    info: {
      name: {
        first: 'John',
        middle: 'M',
        last: 'Doe'
      }
    }
  },
  business: {
    sbi: '123456789',
    organisationId: '5565448',
    info: {
      name: 'Acme Farms Ltd'
    }
  }
}

const mappedData = {
  info: {
    userName: 'John Doe'
  },
  business: {
    info: {
      name: 'Acme Farms Ltd',
      organisationId: '5565448',
      sbi: '123456789'
    }
  }
}

export {
  dalData,
  mappedData
}
