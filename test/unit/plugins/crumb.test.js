import { describe, test, expect } from 'vitest'
import { crumb } from '../../../src/plugins/crumb.js'
import Crumb from '@hapi/crumb'

describe('crumb', () => {
  test('should return an object', () => {
    expect(crumb).toBeInstanceOf(Object)
  })

  test('should register the Crumb plugin', () => {
    expect(crumb.plugin).toBe(Crumb)
  })

  test('should set isSecure based on the environment', () => {
    expect(crumb.options.cookieOptions.isSecure).toBe(process.env.NODE_ENV === 'production')
  })
})
