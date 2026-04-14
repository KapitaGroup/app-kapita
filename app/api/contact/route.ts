import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {noUser400} from '@/utils/apiResponses'

export const POST = async (request: Request) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const contact = await request.json()

  const result = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      inputs: [
        {
          properties: {
            phone: contact.phone ?? '',
            firstname: contact?.name?.split(' ')?.[0] ?? '',
            lastname: contact?.name?.split(' ')?.[1] ?? ''
          },
          id: contact.email,
          idProperty: 'email'
        }
      ]
    })
  })

  if (!result.ok) return Response.json({message: 'Could not create contact!'}, {status: 400})

  return Response.json(true)
}
