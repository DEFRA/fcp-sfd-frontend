/**
 * Shapes raw DAL responses into a consistent format.
 * Responses from the DAL (success or error) pass through here
 * so the rest of the app always gets the same { data, statusCode, errors } shape.
 */
import { constants as httpConstants } from 'node:http2'

/**
 * Wraps data, errors, and status code into a standard response object.
 * Defaults to a 200 success with no data or errors if nothing is provided.
 */
const formatDalResponse = ({
  data = null,
  errors = null,
  statusCode = httpConstants.HTTP_STATUS_OK
}) => {
  return {
    data,
    statusCode,
    errors
  }
}

/**
 * Converts raw GraphQL errors into a simpler shape with a status code.
 * Tries to extract a more detailed message and HTTP status from the
 * error extensions the DAL attaches, falling back to 400 Bad Request.
 */
const mapDalErrors = (responseErrors) => {
  return responseErrors.map(err => {
    const ext = err.extensions
    const parsedMessage = ext?.parsedBody?.message
    const statusCode = ext?.parsedBody?.statusCode || ext?.response?.status || httpConstants.HTTP_STATUS_BAD_REQUEST

    return {
      message: parsedMessage ? `${err.message}: ${parsedMessage}` : err.message,
      statusCode,
      extensions: ext
    }
  })
}

/**
 * Takes the raw JSON body from the DAL and returns a formatted response.
 * If the body contains errors they are mapped and normalised first;
 * otherwise the data is passed through as a success.
 */
const handleDalResponse = (responseBody) => {
  if (responseBody.errors) {
    const extendedErrors = mapDalErrors(responseBody.errors)
    return formatDalResponse({
      statusCode: extendedErrors[0]?.statusCode,
      errors: extendedErrors
    })
  }
  return formatDalResponse({ data: responseBody.data })
}

export {
  formatDalResponse,
  handleDalResponse
}
