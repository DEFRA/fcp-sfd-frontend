import { describe, test, expect, jest } from '@jest/globals'
import Joi from 'joi'
import {
  getBusinessNameChange,
  postBusinessNameChange,
  businessNameChangeRoutes
} from '../../../../src/routes/business-details/business-name-change.js'

describe('Business Name Routes Unit Tests', () => {
  describe('GET /business-name-change', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessNameChange.method).toBe('GET')
      expect(getBusinessNameChange.path).toBe('/business-name-change')
    })

    test('should render the correct view with correct data', () => {
      const h = {
        view: jest.fn().mockReturnThis()
      }

      getBusinessNameChange.handler({}, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-name-change', {
        pageTitle: 'What is your business name?',
        heading: 'Update the name for your business.'
      })
    })
  })

  describe('POST /business-name-change', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessNameChange.method).toBe('POST')
      expect(postBusinessNameChange.path).toBe('/business-name-change')
    })

    describe('Validation', () => {
      test('should validate empty business name', () => {
        const schema = postBusinessNameChange.options.validate.payload

        const result = Joi.object(schema).validate({ businessName: '' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter business name')
      })

      test('should validate max length of business name', () => {
        const schema = postBusinessNameChange.options.validate.payload
        const longBusinessName = 'a'.repeat(301)

        const result = Joi.object(schema).validate({ businessName: longBusinessName })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Business name must be 300 characters or less')
      })

      test('should accept valid business name', () => {
        const schema = postBusinessNameChange.options.validate.payload

        const result = Joi.object(schema).validate({ businessName: 'Acme Corporation' })

        expect(result.error).toBeFalsy()
      })
    })

    test('should redirect to parent page on successful submission', () => {
      const request = {
        payload: {
          businessName: 'Test Business'
        }
      }

      const h = {
        redirect: jest.fn().mockReturnThis()
      }

      postBusinessNameChange.options.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/placeholder-for-parent-page')
    })

    test('should handle validation failures correctly', async () => {
      const request = {
        payload: { businessName: '' }
      }

      const h = {
        view: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis(),
        takeover: jest.fn().mockReturnThis()
      }

      const err = {
        details: [
          {
            path: ['businessName'],
            message: 'Enter business name'
          }
        ]
      }

      await postBusinessNameChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business-details/business-name-change', {
        pageTitle: 'What is your business name?',
        heading: 'Update the name for your business.',
        businessName: '',
        errors: {
          businessName: {
            text: 'Enter business name'
          }
        }
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })
  })

  test('should export all routes', () => {
    expect(businessNameChangeRoutes).toEqual([
      getBusinessNameChange,
      postBusinessNameChange
    ])
  })
})
