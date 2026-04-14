import {ReactNode} from 'react'
import {FieldValues, UseFormReturn, useFormContext} from 'react-hook-form'

export const ConnectForm = ({children}: {children: (methods: UseFormReturn<FieldValues, unknown, undefined>) => ReactNode}) => {
  const methods = useFormContext()

  return children({...methods})
}
