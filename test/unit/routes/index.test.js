import { describe, test, expect } from 'vitest'
import { index } from '../../../src/routes/index-routes'

describe('index', () => {
  test('should return an object', () => {
    expect(index).toBeInstanceOf(Object)
  })

  test('should return GET / route', () => {
    expect(index.method).toBe('GET')
    expect(index.path).toBe('/')
  })

  test('should try and authenticate using default strategy', () => {
    expect(index.options.auth.strategy).toBeUndefined()
    expect(index.options.auth.mode).toBe('try')
  })

  test('should have a handler', () => {
    expect(index.handler).toBeInstanceOf(Function)
  })
})
