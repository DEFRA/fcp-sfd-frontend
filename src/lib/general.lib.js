/**
 * General helper methods
 * @module GeneralLib
 */

/**
 * Creates a flash notification using yar.
 *
 * This function adds a key/value to 'notification' in yar.
 *
 * @param {object} yar - The Hapi `request.yar` session manager passed on by the controller
 * @param {string} [title='Updated'] - title for the notification
 * @param {string} [text='Changes made'] - text for the notification
 *
 */
const flashNotification = (yar, title = 'Updated', text = 'Changes made') => {
  yar.flash('notification', {
    title,
    text
  })
}

export const GeneralLib = [
  flashNotification
]
