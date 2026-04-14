import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {noUser400} from '@/utils/apiResponses'
import {fetchHubspotContact} from '@/utils/hubspotContact'

export const GET = async (_: Request, {params}: {params: {email: string}}) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const result = await fetchHubspotContact(params.email)

  if (!result.ok) return Response.json({})
  const body = await result.json()

  return Response.json(body?.properties)
}
