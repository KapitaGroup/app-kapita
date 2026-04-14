'use client'
type Props = {
  error: Error & {digest?: string}
  reset: () => void
}
const ErrorPage = ({error, reset}: Props) => {
  console.error(error)

  return (
    <main className="flex flex-col items-center justify-center gap-5 pt-4 xl:pt-6">
      <h2>An error occurred! Please report this to the administrator!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()} title="Try again" />
    </main>
  )
}
export default ErrorPage
