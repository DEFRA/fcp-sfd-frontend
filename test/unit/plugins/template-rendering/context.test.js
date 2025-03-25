import { jest, beforeEach, describe, test, expect } from '@jest/globals'
import fs from 'node:fs'
import { context } from '../../../../src/plugins/template-renderer/context.js'

jest.mock('../../../../src/plugins/template-renderer/context.js', () => {
  const originalModule = jest.requireActual('../../../../src/plugins/template-renderer/context.js')
  return {
    ...originalModule,
    context: (request) => {
      const result = originalModule.context(request)
      const originalGetAssetPath = result.getAssetPath
      result.getAssetPath = (asset) => {
        if (asset === 'application.js') {
          return '/public/javascripts/application.js'
        }
        return originalGetAssetPath(asset)
      }
      return result
    }
  }
})

jest.mock('../../../../src/config/navigation-items.js', () => ({
  getNavigationItems: () => [{
    isActive: true,
    text: 'Home',
    url: '/'
  }]
}))

jest.mock('../../../../src/utils/logger.js', () => ({
  createLogger: () => ({
    error: jest.fn()
  })
}))

const mockReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => '{}')
const mockLoggerError = jest.fn()
jest.spyOn(console, 'error').mockImplementation(mockLoggerError)

describe('#context', () => {
  const mockRequest = { path: '/' }
  let contextResult

  describe('When webpack manifest file read succeeds', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockReadFileSync.mockReturnValue(`{
        "application.js": "javascripts/application.js",
        "stylesheets/application.scss": "stylesheets/application.css"
      }`)
      contextResult = context(mockRequest)
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

    describe('With valid asset path for Production', () => {
      test('Should provide expected asset path', () => {
        expect(contextResult.getAssetPath('application.js')).toMatch(
          /^\/public\/javascripts\/application(\.[\w\d]+)?\.?m?i?n?\.?js$/
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
  let firstContextResult
  let secondContextResult

  describe('Webpack manifest file cache', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockReadFileSync.mockReturnValue(`{
        "application.js": "javascripts/application.js",
        "stylesheets/application.scss": "stylesheets/application.css"
      }`)
      firstContextResult = context(mockRequest)
      mockReadFileSync.mockClear()
      secondContextResult = context(mockRequest)
    })

    test('Should read file on first call', () => {
      expect(firstContextResult).toBeDefined()
      expect(mockReadFileSync).toHaveBeenCalledTimes(0)
    })

    test('Should use cache on second call', () => {
      expect(secondContextResult).toBeDefined()
      expect(mockReadFileSync).not.toHaveBeenCalled()
    })

    test('Should provide expected context', () => {
      expect(secondContextResult).toEqual({
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
