import CloseIcon from '@/icons/CloseIcon'
import {forwardRef} from 'react'

type Props = {
  title?: string
  children: React.ReactNode
}

export type ModalRef = {
  open: () => void
  close: () => void
}

const Modal = forwardRef<HTMLDialogElement, Props>(({title, children}, ref) => {
  const onClose = () => (ref as {current: {close: () => void}})?.current.close()

  return (
    <dialog ref={ref} className="cursor-pointer rounded-lg backdrop:bg-black backdrop:opacity-30 focus-visible:outline-none">
      <div
        className="flex max-w-[512px] cursor-auto flex-col items-center justify-center gap-y-4 border-[1px] border-neutral-300 p-6 xl:p-12"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between gap-x-[10px]">
          <h1 className="text-h3">{title}</h1>
          <CloseIcon className="cursor-pointer" onClick={onClose} />
        </div>
        {children}
      </div>
    </dialog>
  )
})

Modal.displayName = 'Modal'

export default Modal
