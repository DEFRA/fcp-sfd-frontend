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
    info: {
      name: 'Acme Farms Ltd'
    }
  }
}

const mappedData = {
  info: {
    fullName: {
      first: 'John',
      middle: 'M',
      last: 'Doe'
    }
  },
  business: {
    info: {
      sbi: '123456789',
      name: 'Acme Farms Ltd'
    }
  }
}

export {
  dalData,
  mappedData
}
