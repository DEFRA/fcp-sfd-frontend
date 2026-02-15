// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { validateFixDetailsService } from '../../../src/services/validate-fix-details-service.js'

// Test helpers
import { personalDetailsSchema } from '../../../src/schemas/personal/personal-details-schema.js'
import { businessDetailsSchema } from '../../../src/schemas/business/business-details-schema.js'

describe('validateFixDetailsService', () => {
  let payload
  let orderedSectionsToFix
  let schemas

  describe('when the personal details schema is passed in', () => {
    beforeEach(() => {
      schemas = personalDetailsSchema
    })

    describe('when `name` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['name']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            first: 'John',
            last: 'Doe'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            first: '',
            last: 'Doe'
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['first']
            })
          )
        })
      })
    })

    describe('when `dob` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['dob']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            day: '12',
            month: '12',
            year: '1990'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            day: '31',
            month: '2',
            year: '1700'
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['day', 'month', 'year']
            })
          )
        })
      })
    })

    describe('when `address` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['address']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            address1: '123 Main St',
            city: 'Anytown',
            country: 'Anyshire',
            postcode: 'A1 2BC'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            address1: '123 Main St',
            city: 'Anytown',
            county: 'Anyshire',
            postcode: ''
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['postcode']
            })
          )
        })
      })
    })

    describe('when `email` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['email']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            personalEmail: 'test@email.com'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            personalEmail: 'not-an-email'
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['personalEmail']
            })
          )
        })
      })
    })

    describe('when `phone` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['phone']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            personalTelephone: '0123456789',
            personalMobile: '07123456789'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            personalTelephone: '1',
            personalMobile: ''
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['personalTelephone']
            })
          )
        })
      })
    })

    describe('when multiple sections are on orderedSectionsToFix', () => {
      describe('when `name` and `dob` are sections', () => {
        beforeEach(() => {
          orderedSectionsToFix = ['name', 'dob']
        })

        describe('and valid data is provided for both sections', () => {
          beforeEach(() => {
            payload = {
              first: 'John',
              last: 'Doe',
              day: '12',
              month: '12',
              year: '1990'
            }
          })

          test('it confirms the data is valid', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error).toBeUndefined()
            expect(result.value).toEqual(payload)
          })
        })

        describe('and one section is invalid', () => {
          beforeEach(() => {
            payload = {
              first: '',
              last: 'Doe',
              day: '12',
              month: '12',
              year: '1990'
            }
          })

          test('it fails validation', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error).toBeDefined()
          })

          test('it returns an error for the invalid section only', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error.details[0]).toEqual(
              expect.objectContaining({
                path: ['first']
              })
            )
          })
        })
      })

      describe('when `email`, `address` and `phone` are sections', () => {
        beforeEach(() => {
          orderedSectionsToFix = ['email', 'phone', 'address']
        })

        describe('and both sections are invalid', () => {
          beforeEach(() => {
            payload = {
              personalEmail: 'not-an-email',
              personalTelephone: '1',
              personalMobile: '',
              address1: '123 Main St',
              city: 'Anytown',
              country: 'Anyshire',
              postcode: ''
            }
          })

          test('it fails validation', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error).toBeDefined()
          })

          test('it returns validation errors for both sections', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            const errorPaths = result.error.details.map(detail => detail.path)

            expect(errorPaths).toContainEqual(['personalEmail'])
            expect(errorPaths).toContainEqual(['personalTelephone'])
            expect(errorPaths).toContainEqual(['postcode'])
          })
        })
      })
    })
  })

  describe('when the business details schema is passed in', () => {
    beforeEach(() => {
      schemas = businessDetailsSchema
    })

    describe('when `name` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['name']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            businessName: 'Test Business Ltd'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            businessName: ''
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['businessName']
            })
          )
        })
      })
    })

    describe('when `address` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['address']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            address1: '123 Main St',
            city: 'Anytown',
            country: 'Anyshire',
            postcode: 'A1 2BC'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            address1: '123 Main St',
            city: 'Anytown',
            county: 'Anyshire',
            postcode: ''
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['postcode']
            })
          )
        })
      })
    })

    describe('when `email` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['email']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            businessEmail: 'test@email.com'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            businessEmail: 'not-an-email'
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['businessEmail']
            })
          )
        })
      })
    })

    describe('when `phone` is a section on orderedSectionsToFix', () => {
      beforeEach(() => {
        orderedSectionsToFix = ['phone']
      })

      describe('and valid data is provided', () => {
        beforeEach(() => {
          payload = {
            businessTelephone: '0123456789',
            businessMobile: '07123456789'
          }
        })

        test('it confirms the data is valid', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeUndefined()
          expect(result.value).toEqual(payload)
        })
      })

      describe('and invalid data is provided', () => {
        beforeEach(() => {
          payload = {
            businessTelephone: '1',
            businessMobile: ''
          }
        })

        test('it fails validation', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error).toBeDefined()
        })

        test('it returns a validation error for the name fields', () => {
          const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

          expect(result.error.details[0]).toEqual(
            expect.objectContaining({
              path: ['businessTelephone']
            })
          )
        })
      })
    })

    describe('when multiple sections are on orderedSectionsToFix', () => {
      describe('when `name` and `email` are sections', () => {
        beforeEach(() => {
          orderedSectionsToFix = ['name', 'email']
        })

        describe('and valid data is provided for both sections', () => {
          beforeEach(() => {
            payload = {
              businessName: 'Test Business Ltd',
              businessEmail: 'test@email.com'
            }
          })

          test('it confirms the data is valid', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error).toBeUndefined()
            expect(result.value).toEqual(payload)
          })
        })

        describe('and one section is invalid', () => {
          beforeEach(() => {
            payload = {
              businessName: '',
              businessEmail: 'test@email.com'
            }
          })

          test('it fails validation', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error).toBeDefined()
          })

          test('it returns an error for the invalid section only', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error.details[0]).toEqual(
              expect.objectContaining({
                path: ['businessName']
              })
            )
          })
        })
      })

      describe('when `email`, `address` and `phone` are sections', () => {
        beforeEach(() => {
          orderedSectionsToFix = ['email', 'phone', 'address']
        })

        describe('and both sections are invalid', () => {
          beforeEach(() => {
            payload = {
              businessEmail: 'not-an-email',
              businessTelephone: '1',
              businessMobile: '',
              address1: '123 Main St',
              city: 'Anytown',
              country: 'Anyshire',
              postcode: ''
            }
          })

          test('it fails validation', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            expect(result.error).toBeDefined()
          })

          test('it returns validation errors for both sections', () => {
            const result = validateFixDetailsService(payload, orderedSectionsToFix, schemas)

            const errorPaths = result.error.details.map(detail => detail.path)

            expect(errorPaths).toContainEqual(['businessEmail'])
            expect(errorPaths).toContainEqual(['businessTelephone'])
            expect(errorPaths).toContainEqual(['postcode'])
          })
        })
      })
    })
  })
})
