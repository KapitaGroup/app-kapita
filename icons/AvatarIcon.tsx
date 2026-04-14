import {SVGProps} from 'react'

const AvatarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#14573A" />
    <path
      d="M17.3332 18V16.6667C17.3332 15.9594 17.0522 15.2811 16.5521 14.781C16.052 14.281 15.3737 14 14.6665 14H9.33317C8.62593 14 7.94765 14.281 7.44755 14.781C6.94746 15.2811 6.6665 15.9594 6.6665 16.6667V18"
      stroke="#CDF3E5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.0002 11.3333C13.4729 11.3333 14.6668 10.1394 14.6668 8.66667C14.6668 7.19391 13.4729 6 12.0002 6C10.5274 6 9.3335 7.19391 9.3335 8.66667C9.3335 10.1394 10.5274 11.3333 12.0002 11.3333Z"
      stroke="#CDF3E5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default AvatarIcon
