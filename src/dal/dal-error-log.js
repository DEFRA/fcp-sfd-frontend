/**
 * Builds the log object for DAL GraphQL errors.
 *
 * Only tenant-settable ECS fields are used (see the CDP logging guide), so the
 * detail reaches OpenSearch. Values the user submitted are removed from the
 * messages first, because graphql-js copies submitted values into variable
 * coercion errors.
 *
 * @module dalErrorLog
 */

const DAL_ERROR_TYPE = 'DalGraphQLError'
const UNKNOWN_ERROR_CODE = 'UNKNOWN'
const REDACTED = '[redacted]'
const MESSAGE_SEPARATOR = ' | '

// Matches the submitted value in `Variable "$x" got invalid value <value> at "x.y"; <reason>`.
// Quoted strings are consumed whole so a value containing ` at "` or `; ` is still removed.
const INVALID_VALUE_PATTERN = /(got invalid value )(?:"(?:[^"\\]|\\.)*"|[^"])*?(?= at "|; |$)/g

// Matches the value graphql-js scalars echo at the end of the reason,
// for example `String cannot represent a non string value: 123`.
const SCALAR_VALUE_PATTERN = /(value: ).*$/

// Matches the literal echoed by query validation, for example `Expected value of type "Int", found "abc"`.
const FOUND_VALUE_PATTERN = /(, found ).*$/

// mapDalErrors appends `: <parsedBody.message>`, which is upstream text, so it is removed.
const removeUpstreamMessage = (message, extensions) => {
  const upstreamMessage = extensions?.parsedBody?.message

  if (upstreamMessage && message.endsWith(`: ${upstreamMessage}`)) {
    return message.slice(0, -(upstreamMessage.length + 2))
  }

  return message
}

const removeSubmittedValues = (message) => {
  return message
    .replace(INVALID_VALUE_PATTERN, `$1${REDACTED}`)
    .replace(SCALAR_VALUE_PATTERN, `$1${REDACTED}`)
    .replace(FOUND_VALUE_PATTERN, `$1${REDACTED}`)
}

/**
 * Returns a DAL error message that is safe to log.
 *
 * @param {{ message?: string, extensions?: object }} error - an error from the formatted DAL response
 * @returns {string}
 */
const toLoggableDalMessage = ({ message = '', extensions }) => {
  return removeSubmittedValues(removeUpstreamMessage(message, extensions))
}

/**
 * Builds the pino log object for a DAL response that contains errors.
 *
 * @param {{ statusCode: number, errors: Array<{ message?: string, extensions?: object }> }} result
 * @returns {{ error: { type: string, code: string, message: string }, event: { outcome: string, reason: string } }}
 */
const toDalErrorLog = ({ statusCode, errors }) => ({
  error: {
    type: DAL_ERROR_TYPE,
    code: errors.map(({ extensions }) => extensions?.code ?? UNKNOWN_ERROR_CODE).join(','),
    message: errors.map(toLoggableDalMessage).join(MESSAGE_SEPARATOR)
  },
  event: {
    outcome: 'failure',
    reason: `DAL responded with status ${statusCode}`
  }
})

export {
  toDalErrorLog,
  toLoggableDalMessage
}
