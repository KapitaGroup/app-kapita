type Props = {
  checked: boolean
  name: string
}
const RadioButton = ({checked, name}: Props) => {
  const hoverClasses =
    'group-hover:ring-primary-900 group-hover:bg-primary-100 group-hover:border-primary-100 group-hover:checked:bg-primary-900'
  const focusClasses = 'focus:ring-primary-900 focus:bg-primary-100 focus:border-primary-100 focus:checked:bg-primary-900'
  const activeClasses = 'active:ring-primary-1000 active:bg-primary-200 active:border-primary-200'

  const interactiveClasses = `${hoverClasses} ${focusClasses} ${activeClasses}`

  return (
    <div className="flex align-middle">
      <input
        type="radio"
        checked={checked}
        name={name}
        onChange={() => {}}
        className={`${interactiveClasses} m-[2px] box-border size-[20px] min-h-[20px] min-w-[20px] cursor-pointer appearance-none rounded-full border-[4px] border-white ring-[2px] ring-primary-800 checked:bg-primary-800`}
      />
    </div>
  )
}

export default RadioButton
