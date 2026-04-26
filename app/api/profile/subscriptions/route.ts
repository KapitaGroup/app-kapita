import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {noUser400} from '@/utils/apiResponses'
import {HubSpotSubscriptionIDs} from '@/utils/lists'
import type {SubscriptionType} from '@/utils/types'

const baseURL = 'https://api.hubapi.com/communication-preferences/v4/statuses/'

export const GET = async () => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const response = await fetch(`${baseURL}${currentUser?.email}?channel=email`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
    }
  })

  if (!response.ok) {
    console.error('Could not get HubSpot subscriptions.', response.status)
    return Response.json([])
  }

  const results = (await response.json()).results
  const settings = (Array.isArray(results) ? results : [])
    .filter((subscription: SubscriptionType) => HubSpotSubscriptionIDs.includes(subscription.subscriptionId))
    .map(({subscriptionId, status}: SubscriptionType) => ({subscriptionId, status}) as SubscriptionType)

  return Response.json(settings)
}

export const PUT = async (request: Request) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const sub = (await request.json()) as SubscriptionType

  const response = await fetch(`${baseURL}${currentUser?.email}?channel=email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      subscriptionId: sub.subscriptionId,
      statusState: sub.status,
      channel: 'EMAIL'
    })
  })

  if (!response.ok) return Response.json({message: 'Could not update subscriptions.'}, {status: 400})

  return Response.json(true)
}
