const formatters = {
  EEE: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }),
  EEEE: new Intl.DateTimeFormat('en-GB', { weekday: 'long' }),
  MMMM: new Intl.DateTimeFormat('en-GB', { month: 'long' })
}

const ordinalSuffix = (day) => {
  const modulo100 = day % 100

  if (modulo100 >= 11 && modulo100 <= 13) {
    return `${day}th`
  }

  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
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
    h: String((hours % 12) || 12),
    mm: String(date.getMinutes()).padStart(2, '0'),
    aaa: hours < 12 ? 'am' : 'pm'
  }
}

const resolveDate = (value) => {
  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

const formatWithPattern = (date, pattern) => {
  const literals = []
  const tokenLookup = tokenValues(date)
  const escapedPattern = pattern.replace(/'([^']*)'/g, (_, literal) => {
    literals.push(literal)
    return `__LITERAL_${literals.length - 1}__`
  })

  const renderedPattern = escapedPattern
    .replace(/yyyy|MMMM|EEEE|EEE|do|aaa|mm|h/g, (token) => tokenLookup[token] ?? token)

  return renderedPattern.replace(/__LITERAL_(\d+)__/g, (_, index) => literals[Number(index)] ?? '')
}

export const formatDate = (value, formattedDateStr = 'EEE do MMMM yyyy') => {
  const date = resolveDate(value)

  if (!date) {
    return ''
  }

  return formatWithPattern(date, formattedDateStr)
}
