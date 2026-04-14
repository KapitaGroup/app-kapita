import {useFormContext} from 'react-hook-form'
import {type ProfileForm} from '../page'

type Props = {
  label: string
  edit: React.ReactNode
  readonlyValue?: React.ReactNode
}
const Field = ({label, edit, readonlyValue}: Props) => {
  const {watch} = useFormContext<ProfileForm>()

  return (
    <div className="flex w-full flex-col gap-y-1">
      <h1 className="text-description">{label}</h1>
      {watch('isEdit') ? edit : <span className="min-h-[42px] pb-3 pt-[11px]">{readonlyValue}</span>}
    </div>
  )
}

export default Field
