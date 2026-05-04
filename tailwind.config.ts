import type {Config} from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const textPrimary = '#161515'
const textSecondary = '#757472'
const textDisabled = '#BDBBB7'
const fillBackground = '#FEFEFE'
const fillDisabled = textSecondary

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fff',
      black: '#000',
      'fill-background': fillBackground,
      'fill-disabled': fillDisabled,
      disabled: textDisabled,
      warning: '#D0342C',
      neutral: {
        0: fillBackground,
        50: '#FAFAFA',
        100: '#F7F7F5',
        200: '#F5F3EE',
        300: '#E0DEDA',
        400: textDisabled,
        500: '#9E9D99',
        600: textSecondary,
        700: '#61605E',
        800: '#2E2D2D',
        900: textPrimary,
        1000: '#050505'
      },
      primary: {
        DEFAULT: textPrimary,
        50: '#EEFBF6',
        100: '#CDF3E5',
        200: '#ADEBD4',
        300: '#8CE3C3',
        400: '#5BD7AA',
        500: '#30C58E',
        600: '#28A477',
        700: '#1E8558',
        800: '#14573A',
        900: '#0F432C',
        1000: '#082116'
      },
      secondary: {
        DEFAULT: textSecondary
      },
      accent: {
        100: '#FCF6EE',
        200: '#F6E3CB',
        300: '#F0D0A8',
        400: '#EABD85',
        500: '#E1B061',
        600: '#D89831',
        700: '#BC8224',
        800: '#9A6A1D',
        900: '#785317',
        1000: '#563B10'
      },
      transparency: {
        10: 'rgb(0, 0, 0, 0.9)',
        15: 'rgb(0, 0, 0, 0.85)',
        20: 'rgb(0, 0, 0, 0.8)'
      }
    },
    extend: {
      fontFamily: {
        lexendDeca: ['var(--font-saans)', 'Inter', 'Arial', 'sans-serif']
      },
      boxShadow: {
        default: '1px 2px 4px 0px rgba(0, 0, 0, 0.12)',
        M31: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        M32: '0px 1px 2px 0px rgba(0, 0, 0, 0.30)'
      }
    }
  },
  plugins: [
    plugin(({addUtilities, addVariant}) => {
      addUtilities({
        '.text-h1': {'@apply text-[32px] leading-[43.3px] font-lexendDeca': {}},
        '.text-h2': {'@apply text-[32px] leading-[43.62px] font-lexendDeca font-semibold': {}},
        '.text-h3': {'@apply text-[24px] leading-[32.54px] font-lexendDeca font-medium': {}},
        '.text-h4': {'@apply text-[20px] leading-[27.2px] font-lexendDeca font-semibold': {}},
        '.text-h5': {'@apply text-[18px] leading-[24.35px] font-lexendDeca font-medium': {}},
        '.text-h6': {'@apply text-[16px] leading-[21.76px] font-lexendDeca font-medium': {}},
        '.text-button': {'@apply text-[16px] leading-[21.7px] font-lexendDeca font-medium': {}},
        '.text-button-link': {
          '@apply text-[16px] leading-[21.7px] underline font-lexendDeca font-medium': {}
        },
        '.text-body': {'@apply text-[16px] leading-[21.7px] font-lexendDeca': {}},
        '.text-description-unread': {
          '@apply text-[14px] leading-[19.04px] font-lexendDeca font-medium': {}
        },
        '.text-description': {'@apply text-[14px] leading-[18.94px] font-lexendDeca': {}},
        '.text-disclaimer': {'@apply text-[12px] leading-[16.27px] font-lexendDeca': {}},
        '.text-disclaimer-link': {'@apply text-[12px] leading-[16.27px] underline font-lexendDeca': {}},
        '.grid-layout': {'@apply grid grid-cols-4 xl:grid-cols-12 gap-x-4 xl:gap-x-6': {}},
        '.max-content-width': {'@apply xl:w-[648px]': {}}
      })
      addVariant('starting', '@starting-style')
    })
  ]
}
export default config
