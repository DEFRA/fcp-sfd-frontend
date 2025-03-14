import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { createServer } from '../../../../src/server.js'
import { routes } from '../../../../src/routes/index.js'

describe('Routes Integration Test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })
  test('routes module exports expected routes', () => {
    expect(Array.isArray(routes)).toBe(true)
    expect(routes.length).toBeGreaterThan(0)

    routes.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
    })
  })

  test('server has required routes registered', async () => {
    const table = server.table()
    const homeRoute = table.find(route => route.path === '/' && route.method === 'get')
    expect(homeRoute).toBeDefined()
    const healthRoute = table.find(route => route.path === '/health' && route.method === 'get')
    expect(healthRoute).toBeDefined()
    const serviceUnavailableRoute = table.find(route => route.path === '/service-unavailable' && route.method === 'get')
    expect(serviceUnavailableRoute).toBeDefined()
    const staticAssetsRoute = table.find(route => route.path === '/public/{param*}')
    expect(staticAssetsRoute).toBeDefined()
  })
})
