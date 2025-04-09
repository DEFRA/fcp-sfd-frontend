export function toErrorList (errors) {
  if (!errors) {
    return []
  }

  return Object.entries(errors).map(([field, error]) => ({
    text: error.text,
    href: `#${field}`
  }))
}
