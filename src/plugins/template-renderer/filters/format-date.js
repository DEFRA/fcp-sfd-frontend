const ORDINAL_MODULO_BASE = 100
const ORDINAL_SPECIAL_RANGE_START = 11
const ORDINAL_SPECIAL_RANGE_END = 13
const ORDINAL_SUFFIX_MODULO_BASE = 10
const ORDINAL_SUFFIX_ST = 1
const ORDINAL_SUFFIX_ND = 2
const ORDINAL_SUFFIX_RD = 3
const TWELVE_HOUR_CLOCK_BASE = 12
const MINUTE_PAD_LENGTH = 2
const LITERAL_INDEX_OFFSET = 1

const formatters = {
  EEE: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }),
  EEEE: new Intl.DateTimeFormat('en-GB', { weekday: 'long' }),
  MMMM: new Intl.DateTimeFormat('en-GB', { month: 'long' })
}

const ordinalSuffix = (day) => {
  const modulo100 = day % ORDINAL_MODULO_BASE

  if (modulo100 >= ORDINAL_SPECIAL_RANGE_START && modulo100 <= ORDINAL_SPECIAL_RANGE_END) {
    return `${day}th`
  }

  switch (day % ORDINAL_SUFFIX_MODULO_BASE) {
    case ORDINAL_SUFFIX_ST:
      return `${day}st`
    case ORDINAL_SUFFIX_ND:
      return `${day}nd`
    case ORDINAL_SUFFIX_RD:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

const tokenValues = (date) => {
  const hours = date.getHours()

  return {
    yyyy: String(date.getFullYear()),
    MMMM: formatters.MMMM.format(date),
    EEEE: formatters.EEEE.format(date),
    EEE: formatters.EEE.format(date),
    do: ordinalSuffix(date.getDate()),
    h: String((hours % TWELVE_HOUR_CLOCK_BASE) || TWELVE_HOUR_CLOCK_BASE),
    mm: String(date.getMinutes()).padStart(MINUTE_PAD_LENGTH, '0'),
    aaa: hours < TWELVE_HOUR_CLOCK_BASE ? 'am' : 'pm'
  }
}

const resolveDate = (value) => {
  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

const formatWithPattern = (date, pattern) => {
  const literals = []
  const tokenLookup = tokenValues(date)
  const escapedPattern = pattern.replaceAll(/'([^']*)'/g, (_, literal) => {
    literals.push(literal)
    return `__LITERAL_${literals.length - LITERAL_INDEX_OFFSET}__`
  })

  const renderedPattern = escapedPattern
    .replaceAll(/yyyy|MMMM|EEEE|EEE|do|aaa|mm|h/g, (token) => tokenLookup[token] ?? token)

  return renderedPattern.replaceAll(/__LITERAL_(\d+)__/g, (_, index) => literals[Number(index)] ?? '')
}

export const formatDate = (value, formattedDateStr = 'EEE do MMMM yyyy') => {
  const date = resolveDate(value)

  if (!date) {
    return ''
  }

  return formatWithPattern(date, formattedDateStr)
}
