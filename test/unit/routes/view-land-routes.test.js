// Test framework dependencies
import { vi, describe, test, expect } from 'vitest'

// Thing under test
import { viewLandRoutes } from '../../../src/routes/view-land-routes.js'
const [viewLand] = viewLandRoutes

describe('View land endpoint', () => {
  describe('GET /view-land', () => {
    test('it renders the view land view with a back link to the home page', () => {
      const h = { view: vi.fn() }

      viewLand.handler({}, h)

      expect(h.view).toHaveBeenCalledWith('view-land', {
        pageTitle: 'View land',
        backLink: {
          text: 'Back',
          href: '/home'
        }
      })
    })
  })
})
