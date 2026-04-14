import {type LocaleType} from '@/i18n/routing'
import {Container, Html, Tailwind, Heading, Text, Img, Link} from '@react-email/components'

type Props = {
  locale: LocaleType
  title: string
  description: string
  code: string
  footer: string
}
const EmailVerification = ({locale, title, description, code, footer}: Props) => (
  <Html lang={locale} dir="ltr">
    <Container>
      <Tailwind>
        <Img src="https://kapita.vercel.app/images/Logo.png" alt="Logo" width="223" height="96" />
        <Heading as="h1" className="pb-3 pt-4 text-[33px] leading-[50px]">
          {title}
        </Heading>
        <Text className="text-[16px] leading-[24px]">{description}</Text>
        <Text className="py-6 text-[33px]">{code}</Text>
        <Text className="text-[13px] leading-[16px] text-[#A59E9E]">
          {footer}
          <Link href="https://www.kapita.com/contact" aria-label="Kapita contact">
            kapita.com/contact
          </Link>
        </Text>
      </Tailwind>
    </Container>
  </Html>
)

export default EmailVerification
