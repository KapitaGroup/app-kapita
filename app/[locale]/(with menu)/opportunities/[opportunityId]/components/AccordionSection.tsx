type Props = {
  title?: string
  text?: string
  list?: string[]
}
const AccordionSection = ({title, text}: Props) => {
  if (!title && !text) return null

  return (
    <div className="flex flex-col gap-y-1">
      {title && <h1 className="text-h5">{title}</h1>}
      {text && <p>{text}</p>}
    </div>
  )
}

export default AccordionSection
