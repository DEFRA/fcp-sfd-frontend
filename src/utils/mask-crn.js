const MASK_VISIBLE_DIGITS = 4

export const maskCrn = (crn) => {
  if (crn === null || crn === undefined) { return '****' }
  const str = String(crn)
  if (str.length <= MASK_VISIBLE_DIGITS) { return str }
  return '*'.repeat(str.length - MASK_VISIBLE_DIGITS) + str.slice(-MASK_VISIBLE_DIGITS)
}
