'use client'
import {FormProvider, useForm} from 'react-hook-form'
import ContactInfo from './components/ContactInfo'
import ProfileData from './components/ProfileData'
import ProfileProgress from './components/ProfileProgress'
import type {ProfileType} from '@/utils/types'
import {useProfile} from '@/hooks/useProfile'
import {useEffect, useRef, useState} from 'react'
import PageLoading from '@/components/PageLoading'
import InvestmentActivity from './components/InvestmentActivity'
import ProfileHeader from './components/ProfileHeader'
import InvestingFor from './components/InvestingFor'
import Modal from '@/components/Modal'
import {useTranslations} from 'next-intl'
import Stage from '../../profile/components/Stage'

export type ProfileForm = {
  isEdit: boolean
  imageToUpload?: string
  errors: {[key: string]: string}
} & ProfileType

const Page = () => {
  const {profile, isLoading} = useProfile()
  const methods = useForm<ProfileForm>()
  const modalRef = useRef<HTMLDialogElement>(null)
  const t = useTranslations('')
  const [tab, setTab] = useState<'profile' | 'needs-analysis'>('profile')

  useEffect(() => {
    methods.reset({
      isEdit: false,
      ...profile,
      email: profile?.email,
      investingFor: profile?.investingFor ?? 'myself'
    })
  }, [methods, profile])

  useEffect(() => {
    const showWarning = localStorage.getItem('user-data-exists') === 'true'
    if (!isLoading && showWarning) {
      modalRef.current?.showModal()
      localStorage.removeItem('user-data-exists')
    }
  }, [isLoading])

  if (isLoading) return <PageLoading />
  if (!profile) return 'User is missing'

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-y-8" onSubmit={e => e.preventDefault()}>
        <ProfileHeader />
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-x-1.5 border-b-2 px-1.5 py-2 ${tab === 'profile' ? 'border-primary-800' : 'border-transparent'}`}
            onClick={() => setTab('profile')}
          >
            <Stage number={1} selected={tab === 'profile'} /> {t('ProfilePage.tabs.about-investor')}
          </button>
          <button
            className={`flex items-center gap-x-1.5 border-b-2 px-1.5 py-2 ${tab === 'needs-analysis' ? 'border-primary-800' : 'border-transparent'}`}
            onClick={() => setTab('needs-analysis')}
          >
            <Stage number={2} selected={tab === 'needs-analysis'} /> {t('ProfilePage.tabs.needs-analysis')}
          </button>
        </div>
        {profile.progress < 100 && <ProfileProgress progress={profile.progress} />}
        {tab === 'profile' && (
          <>
            <InvestingFor />
            <ProfileData />
            <ContactInfo />
          </>
        )}
        {tab === 'needs-analysis' && <InvestmentActivity />}
      </form>
      <Modal ref={modalRef} title={t('ProfilePage.welcome-title')}>
        {t('ProfilePage.welcome-description')}
      </Modal>
    </FormProvider>
  )
}
export default Page
