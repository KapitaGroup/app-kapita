import {useTranslations} from 'next-intl'

type Props = {
  title: string
}
const Title = ({title}: Props) => {
  const t = useTranslations('LoginPage.titles')

  return <div className="text-h1">{t(title)}</div>
}

export default Title
