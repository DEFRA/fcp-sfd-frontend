export const formatValidationErrors = (details) => {
  const errors = {}

  details.forEach(detail => {
    const path = detail.path[0]

    if (detail.type === 'object.missing' && Array.isArray(detail.context?.peers)) {
      detail.context.peers.forEach(peer => {
        errors[peer] = {
          text: detail.message
        }
      })
    } else {
      errors[path] = {
        text: detail.message
      }
    }
  })

  return errors
}
