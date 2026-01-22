export const PERSONAL_SECTION_FIELD_ORDER = {
  name: ['first', 'middle', 'last'],
  dob: ['day', 'month', 'year'],
  address: ['address1', 'address2', 'address3', 'city', 'county', 'postcode', 'country'],
  phone: ['personalTelephone', 'personalMobile'],
  email: ['personalEmail']
}

export const PERSONAL_SECTION_ORDER = ['name', 'dob', 'address', 'phone', 'email']

export const PERSONAL_SECTION_LABELS = {
  name: 'personal name',
  dob: 'personal date of birth',
  address: 'personal address',
  phone: 'personal phone number',
  email: 'personal email address'
}

export const PERSONAL_UPDATE_TEXT_LABELS = {
  name: 'your personal name',
  dob: 'your date of birth',
  address: 'your personal address',
  phone: 'at least one personal phone number',
  email: 'your personal email address'
}
