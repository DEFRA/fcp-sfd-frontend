// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import {
  FULL_PERMISSION,
  MAKE_LEGAL_CHANGES_PERMISSION,
  AMEND_LEVEL_PERMISSION,
  VIEW_LEVEL_PERMISSION,
  LEGAL_PERMISSIONS,
  AMEND_PERMISSIONS,
  VIEW_PERMISSIONS
} from '../../../../src/constants/scope/business-details.js'

describe('business details scopes', () => {
  describe('FULL_PERMISSION', () => {
    test('it matches the full permission scope', () => {
      expect(FULL_PERMISSION).toBe('BUSINESS_DETAILS:FULL_PERMISSION')
    })
  })

  describe('MAKE_LEGAL_CHANGES_PERMISSION', () => {
    test('it matches the make legal changes scope', () => {
      expect(MAKE_LEGAL_CHANGES_PERMISSION).toBe('BUSINESS_DETAILS:MAKE_LEGAL_CHANGES')
    })
  })

  describe('AMEND_LEVEL_PERMISSION', () => {
    test('it matches the amend scope', () => {
      expect(AMEND_LEVEL_PERMISSION).toBe('BUSINESS_DETAILS:AMEND')
    })
  })

  describe('VIEW_LEVEL_PERMISSION', () => {
    test('it matches the view scope', () => {
      expect(VIEW_LEVEL_PERMISSION).toBe('BUSINESS_DETAILS:VIEW')
    })
  })

  describe('LEGAL_PERMISSIONS', () => {
    test('it admits only make legal changes and full permission', () => {
      expect(LEGAL_PERMISSIONS).toEqual([MAKE_LEGAL_CHANGES_PERMISSION, FULL_PERMISSION])
    })

    test('it does not admit amend permission', () => {
      expect(LEGAL_PERMISSIONS).not.toContain(AMEND_LEVEL_PERMISSION)
    })

    test('it does not admit view permission', () => {
      expect(LEGAL_PERMISSIONS).not.toContain(VIEW_LEVEL_PERMISSION)
    })
  })

  describe('AMEND_PERMISSIONS', () => {
    test('it admits amend, make legal changes and full permission', () => {
      expect(AMEND_PERMISSIONS).toEqual([AMEND_LEVEL_PERMISSION, MAKE_LEGAL_CHANGES_PERMISSION, FULL_PERMISSION])
    })

    test('it does not admit view permission', () => {
      expect(AMEND_PERMISSIONS).not.toContain(VIEW_LEVEL_PERMISSION)
    })
  })

  describe('VIEW_PERMISSIONS', () => {
    test('it admits view, amend, make legal changes and full permission', () => {
      expect(VIEW_PERMISSIONS).toEqual([VIEW_LEVEL_PERMISSION, AMEND_LEVEL_PERMISSION, MAKE_LEGAL_CHANGES_PERMISSION, FULL_PERMISSION])
    })
  })
})
