type Props = {
  percentage: number
}
const ProgressLine = ({percentage}: Props) => {
  return (
    <span className="flex min-h-1 w-full overflow-hidden rounded-full bg-neutral-300">
      <span className="flex min-h-1 bg-black" style={{width: `${percentage}%`}}></span>
    </span>
  )
}

export default ProgressLine
