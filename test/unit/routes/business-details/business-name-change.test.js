import { businessNameChange } from '../../../../src/routes/business-details/business-name-change.js'
import { jest, beforeEach, describe, test, expect } from '@jest/globals'

const mockView = jest.fn()
const mockH = {
    view: jest.fn().mockReturnValue(mockView)
}

describe('Business Name Change Route', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should have the correct method and path', () => {
        expect(businessNameChange.method).toBe('GET')
        expect(businessNameChange.path).toBe('/business-name-change')
    })

    test('should return HTTP 200 when accessing the business name change page', () => {
        const result = businessNameChange.handler(null, mockH)
        expect(mockH.view).toHaveBeenCalled()
        expect(result).toBe(mockView)
    })

    test('should render the correct template with the right context', () => {
        businessNameChange.handler(null, mockH)
        expect(mockH.view).toHaveBeenCalledWith(
            'business-details/business-name-change',
            {
                pageTitle: 'What is your business name?',
                heading: 'Update the name for your business.'
            }
        )
    })
})
