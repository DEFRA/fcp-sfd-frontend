/**
 * Test-only stub for personal-business details (dalData, mappedData). Same shape as
 * mapPersonalBusinessDetails from the DAL response; used by unit tests.
 *
 * @module mockPersonalBusinessDetails
 */

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
