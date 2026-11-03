import { describe, test, expect } from 'vitest'
import * as cheerio from 'cheerio'
import { renderTemplate } from '../../../helpers/render-template.js'

const template = '{% from "components/service-card/macro.njk" import serviceCard %}{{ serviceCard({ cards: cards }) }}'

const render = (cards) => cheerio.load(renderTemplate(template, { cards }))

const linkText = ($, index) => $('a.service-card__link').eq(index).text().replace(/\s+/g, ' ').trim()

describe('service card macro', () => {
  test('renders one card per grant with a distinguishable link name', () => {
    const $ = render([
      { title: 'Water Management', status: 'do-not-show', link: '/a' },
      { title: 'Woodland Management Plan', status: 'do-not-show', link: '/b' }
    ])

    expect($('.service-card__list-item-variant')).toHaveLength(2)
    expect(linkText($, 0)).toBe('Go to application for Water Management')
    expect(linkText($, 1)).toBe('Go to application for Woodland Management Plan')
    expect($('a.service-card__link').first().attr('href')).toBe('/a')
  })

  test('renders a start link and grey tag for not-started cards', () => {
    const $ = render([{ title: 'Grant', status: 'not-started', link: '/a' }])

    expect($('.govuk-tag').text().trim()).toBe('Not started')
    expect($('.govuk-tag').hasClass('govuk-tag--grey')).toBe(true)
    expect(linkText($, 0)).toBe('Start application for Grant')
  })

  test('renders a continue link for in-progress cards', () => {
    const $ = render([{ title: 'Grant', status: 'in-progress', link: '/a' }])

    expect($('.govuk-tag').text().trim()).toBe('In progress')
    expect(linkText($, 0)).toBe('Continue application for Grant')
  })

  test('renders no cards when none are supplied', () => {
    const $ = render([])

    expect($('.service-card__list-item-variant')).toHaveLength(0)
  })
})
