export const numberFormatter = (number: number, currency: string = 'SEK') =>
  !number ? '' : `${number >= 1000000 ? `${number / 1000000} m` : `${number} `}${currency}`
