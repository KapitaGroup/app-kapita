'use client'
import {useTranslations} from 'next-intl'

const Error = ({error}: {error: string}) => {
  const t = useTranslations()

  return !!error && <p className="whitespace-pre-line pt-2 text-warning text-description">{t(`Errors.${error}`)}</p>
}

export default Error
