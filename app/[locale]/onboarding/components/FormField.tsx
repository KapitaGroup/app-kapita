'use client'
import {forwardRef} from 'react'

type LabelProps = {
  label: string
  htmlFor?: string
  helper?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const Field = ({label, htmlFor, helper, children, className = ''}: LabelProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label htmlFor={htmlFor} className="text-description text-neutral-600">
      <span className="inline-flex items-center gap-1.5">
        {label}
        {helper}
      </span>
    </label>
    {children}
  </div>
)

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {disabled?: boolean}

export const Input = forwardRef<HTMLInputElement, InputProps>(({className = '', disabled, ...rest}, ref) => (
  <input
    ref={ref}
    disabled={disabled}
    className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-body text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 ${className}`}
    {...rest}
  />
))
Input.displayName = 'Input'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({className = '', children, ...rest}, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={`w-full appearance-none rounded-md border border-neutral-300 bg-white px-3 py-2.5 pr-10 text-body text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none ${className}`}
      {...rest}>
      {children}
    </select>
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500">
      <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
))
Select.displayName = 'Select'
