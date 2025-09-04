/**
 * Resolves a safe back link path from a referer URL or path.
 * - If `referer` is a full URL, returns only the pathname.
 * - If `referer` is already a path, returns it (ensures it starts with `/`).
 * - If `referer` is missing or invalid, returns `/` as fallback.
 *
 * @param {string} referer - The referer header value or path
 * @returns {string} Safe back link path
 */
const dynamicBacklink = (referer) => {
  if (!referer) {
    return '/'
  }

  try {
    return new URL(referer).pathname
  } catch {
    return referer.startsWith('/') ? referer : `/${referer}`
  }
}

export { dynamicBacklink }
