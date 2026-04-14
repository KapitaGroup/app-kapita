'use client'
import Modal from '@/components/Modal'
import InfoIcon from '@/icons/InfoIcon'
import {useTranslations} from 'next-intl'
import {useRef} from 'react'

type Props = {
  label: string
  value: string | number
  info: 'type' | 'stage' | 'minTicketSize' | 'investmentTarget' | 'returnRate' | 'riskFactor' | 'sector'
}
const Attribute = ({label, value, info}: Props) => {
  const t = useTranslations()
  const modalRef = useRef<HTMLDialogElement>(null)

  if (!value) return null

  const onModalOpen = () => {
    const modal = modalRef.current
    if (!modal) return

    if (modal.hasAttribute('open')) modal.close()
    else modal.showModal()
  }

  let infoModal: React.ReactNode

  switch (info) {
    case 'type':
      infoModal = (
        <div className="flex flex-col gap-y-4">
          {[
            'Convertible Note',
            'Publicly Traded Shares',
            'Private Shares',
            'Loan',
            'SAFE (Simple Agreement for Future)',
            'Funds',
            'Commodities',
            'Futures',
            'Bonds',
            'Crypto'
          ].map(option => (
            <div key={option}>
              <h1 className="pb-[2px] text-h6">{t(`attributes.type.options.${option}`)}</h1>
              <p className="text-body">{t(`attributes.type.descriptions.${option}`)}</p>
            </div>
          ))}
        </div>
      )
      break
    case 'stage':
      infoModal = (
        <div className="flex flex-col gap-y-4">
          {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Initial Public Offering'].map(option => (
            <div key={option}>
              <h1 className="pb-[2px] text-h6">{t(`attributes.stage.options.${option}`)}</h1>
              <p className="text-body">{t(`attributes.stage.descriptions.${option}`)}</p>
            </div>
          ))}
        </div>
      )
      break
    case 'minTicketSize':
      infoModal = <p className="whitespace-pre-line">{t('attributes.minimal-ticket-size.description')}</p>
      break
    case 'investmentTarget':
      infoModal = <p className="whitespace-pre-line">{t('attributes.target.description')}</p>
      break
    case 'returnRate':
      infoModal = <p className="whitespace-pre-line">{t('attributes.return-rate.description')}</p>
      break
    case 'riskFactor':
      infoModal = <p className="whitespace-pre-line">{t('attributes.risk-factor.description')}</p>
      break
    case 'sector':
      infoModal = <p className="whitespace-pre-line">{t('attributes.sector.description')}</p>
      break
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <p className="w-fit text-description">{label}</p>
        <div onClick={onModalOpen}>
          <InfoIcon className="cursor-pointer text-neutral-700" />
          <Modal ref={modalRef} title={label}>
            {infoModal}
          </Modal>
        </div>
      </div>
      <div className="text-right">{value}</div>
    </div>
  )
}

export default Attribute
