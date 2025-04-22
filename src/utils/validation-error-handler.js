export const formatValidationErrors = (details) => {
  const errors = {}

  details.forEach(detail => {
    const path = detail.path[0]
    errors[path] = {
      text: detail.message
    }
  })

  return errors
}
