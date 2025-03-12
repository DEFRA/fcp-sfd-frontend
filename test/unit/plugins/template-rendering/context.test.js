import { jest, beforeAll, beforeEach, describe, test, expect } from '@jest/globals'
import fs from 'node:fs'

const mockReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
  return '{}'
})

const mockLoggerError = jest.fn()
jest.spyOn(console, 'error').mockImplementation(mockLoggerError)

describe('#context', () => {
  const mockRequest = { path: '/' }
  let contextResult

  describe('When webpack manifest file read succeeds', () => {
    let contextImport

    beforeAll(async () => {
      mockReadFileSync.mockReturnValue(`{
        "application.js": "javascripts/application.js",
        "stylesheets/application.scss": "stylesheets/application.css"
      }`)
      jest.resetModules()
      contextImport = await import('../../../../src/plugins/template-renderer/context.js')
    })

    beforeEach(() => {
      contextResult = contextImport.context(mockRequest)
    })

    test('Should provide expected context', () => {
      expect(contextResult).toEqual({
        assetPath: '/public/assets',
        breadcrumbs: [],
        getAssetPath: expect.any(Function),
        navigation: [
          {
            isActive: true,
            text: 'Home',
            url: '/'
          }
        ],
        serviceName: 'Single Front Door',
        serviceUrl: '/'
      })
    })

    describe('With valid asset path', () => {
      test('Should provide expected asset path', () => {
        expect(contextResult.getAssetPath('application.js')).toBe(
          '/public/javascripts/application.js'
        )
      })
    })

    describe('With invalid asset path', () => {
      test('Should provide expected asset', () => {
        expect(contextResult.getAssetPath('an-image.png')).toBe(
          '/public/an-image.png'
        )
      })
    })
  })
})

describe('#context cache', () => {
  const mockRequest = { path: '/' }
  let contextResult

  describe('Webpack manifest file cache', () => {
    let contextImport

    beforeAll(async () => {
      contextImport = await import('../../../../src/plugins/template-renderer/context.js')
    })

    beforeEach(() => {
      mockReadFileSync.mockReturnValue(`{
        "application.js": "javascripts/application.js",
        "stylesheets/application.scss": "stylesheets/application.css"
      }`)

      contextResult = contextImport.context(mockRequest)
    })

    test('Should read file', () => {
      expect(mockReadFileSync).toHaveBeenCalled()
    })

    test('Should use cache', () => {
      expect(mockReadFileSync).not.toHaveBeenCalled()
    })

    test('Should provide expected context', () => {
      expect(contextResult).toEqual({
        assetPath: '/public/assets',
        breadcrumbs: [],
        getAssetPath: expect.any(Function),
        navigation: [
          {
            isActive: true,
            text: 'Home',
            url: '/'
          }
        ],
        serviceName: 'Single Front Door',
        serviceUrl: '/'
      })
    })
  })
})
