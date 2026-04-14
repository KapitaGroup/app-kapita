export const isEmailValid = (email?: string | null): boolean =>
  !!email &&
  !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )

export const isPhoneValid = (phone?: string | null) => !!phone
// Disabled swedish phone number validation because it is required to accept all countries for now.
// !!phone &&
// !!String(phone)
//   .toLowerCase()
//   .match(/^(?:\+467|07)\d{8}$/gm)

export const isPersonNumberValid = (personNumber?: string | null) =>
  !!personNumber && !!String(personNumber).match(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])-\d{4}$/)

export const formatPhone = (phone?: string | null) => (phone?.startsWith('0') ? phone.replace('0', '+46') : (phone ?? null))
