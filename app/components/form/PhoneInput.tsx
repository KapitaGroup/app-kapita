'use client'
import {useEffect, useRef, useState} from 'react'

// Common countries with dial codes and flag emojis
// Sorted alphabetically by country name
export const COUNTRIES = [
  {code: 'AF', name: 'Afghanistan', dial: '+93', flag: '🇦🇫'},
  {code: 'AL', name: 'Albania', dial: '+355', flag: '🇦🇱'},
  {code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿'},
  {code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷'},
  {code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺'},
  {code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹'},
  {code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭'},
  {code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩'},
  {code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪'},
  {code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷'},
  {code: 'BG', name: 'Bulgaria', dial: '+359', flag: '🇧🇬'},
  {code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦'},
  {code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱'},
  {code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳'},
  {code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴'},
  {code: 'HR', name: 'Croatia', dial: '+385', flag: '🇭🇷'},
  {code: 'CZ', name: 'Czech Republic', dial: '+420', flag: '🇨🇿'},
  {code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰'},
  {code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬'},
  {code: 'EE', name: 'Estonia', dial: '+372', flag: '🇪🇪'},
  {code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮'},
  {code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷'},
  {code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪'},
  {code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷'},
  {code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰'},
  {code: 'HU', name: 'Hungary', dial: '+36', flag: '🇭🇺'},
  {code: 'IS', name: 'Iceland', dial: '+354', flag: '🇮🇸'},
  {code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳'},
  {code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩'},
  {code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪'},
  {code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱'},
  {code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹'},
  {code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵'},
  {code: 'JO', name: 'Jordan', dial: '+962', flag: '🇯🇴'},
  {code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪'},
  {code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼'},
  {code: 'LV', name: 'Latvia', dial: '+371', flag: '🇱🇻'},
  {code: 'LB', name: 'Lebanon', dial: '+961', flag: '🇱🇧'},
  {code: 'LT', name: 'Lithuania', dial: '+370', flag: '🇱🇹'},
  {code: 'LU', name: 'Luxembourg', dial: '+352', flag: '🇱🇺'},
  {code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾'},
  {code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽'},
  {code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦'},
  {code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱'},
  {code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿'},
  {code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬'},
  {code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴'},
  {code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲'},
  {code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰'},
  {code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭'},
  {code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱'},
  {code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹'},
  {code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦'},
  {code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴'},
  {code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺'},
  {code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦'},
  {code: 'RS', name: 'Serbia', dial: '+381', flag: '🇷🇸'},
  {code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬'},
  {code: 'SK', name: 'Slovakia', dial: '+421', flag: '🇸🇰'},
  {code: 'SI', name: 'Slovenia', dial: '+386', flag: '🇸🇮'},
  {code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦'},
  {code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷'},
  {code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸'},
  {code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰'},
  {code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪'},
  {code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭'},
  {code: 'TW', name: 'Taiwan', dial: '+886', flag: '🇹🇼'},
  {code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭'},
  {code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷'},
  {code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦'},
  {code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪'},
  {code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧'},
  {code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸'},
  {code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳'}
]

const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'SE')! // Sweden default

type Props = {
  label?: string
  number: string
  onNumberChange: (number: string) => void
  dial: string
  onDialChange: (dial: string) => void
  onEnter?: () => void
  error?: string
}

const PhoneInput = ({label, number, onNumberChange, dial, onDialChange, onEnter, error}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selected = COUNTRIES.find(c => c.dial === dial) ?? DEFAULT_COUNTRY

  // Initialize default if no dial is set yet
  useEffect(() => {
    if (!dial) onDialChange(DEFAULT_COUNTRY.dial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = COUNTRIES.filter(c => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
  })

  const onSelectCountry = (newDial: string) => {
    onDialChange(newDial)
    setIsOpen(false)
    setSearch('')
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) onEnter()
  }

  return (
    <div className="flex w-full flex-col gap-1 pt-[2px]">
      {label && (
        <label className={`text-description ${!number ? 'opacity-0' : ''}`}>{label}</label>
      )}
      <div
        ref={wrapperRef}
        className={`relative flex w-full items-center gap-x-2 border-b-[1px] ${
          error ? 'border-b-warning' : 'border-neutral-800'
        }`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="my-[10px] flex items-center gap-1 pr-2 text-neutral-900 hover:text-neutral-700"
          aria-label="Select country">
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-sm font-medium">{selected.dial}</span>
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          type="tel"
          value={number}
          onChange={e => onNumberChange(e.target.value.replace(/[^0-9\s-]/g, ''))}
          onKeyUp={onKeyUp}
          placeholder={label}
          className="my-[10px] min-h-[1.3rem] w-full placeholder:text-neutral-600 focus:!outline-none focus-visible:!outline-none"
        />

        {isOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-72 w-full min-w-[280px] overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
            <div className="border-b border-neutral-100 p-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country or code..."
                autoFocus
                className="w-full rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto">
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-sm text-neutral-500">No matches</li>
              )}
              {filtered.map(c => (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => onSelectCountry(c.dial)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
                      c.dial === dial ? 'bg-neutral-50 font-medium' : ''
                    }`}>
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-neutral-500">{c.dial}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!!error && <p className="whitespace-pre-line pt-2 text-warning text-description">{error}</p>}
    </div>
  )
}

export default PhoneInput
