import { describe, test, expect, vi } from 'vitest'
import { Metrics } from '@defra/cdp-metrics'

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() })
}))

describe('metrics', () => {
  test('exports a shared cdp-metrics instance', async () => {
    const { metrics } = await import('../../../src/utils/metrics.js')

    expect(metrics).toBeInstanceOf(Metrics)
  })

  test('exposes the counter and millis methods used by the DAL token service', async () => {
    const { metrics } = await import('../../../src/utils/metrics.js')

    expect(typeof metrics.counter).toBe('function')
    expect(typeof metrics.millis).toBe('function')
  })
})
