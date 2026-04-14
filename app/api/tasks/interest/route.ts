import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {noUser400} from '@/utils/apiResponses'

export const POST = async (request: Request) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const {hubspotId, name, email, phone, investingFor, personNumber, organizationNumber, organizationName, buy, sell} = await request.json()

  const result = await fetch('https://api.hubapi.com/crm/v3/objects/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_task_subject: `${name} showed interest for secondaries`,
        hs_task_type: 'CALL',
        hs_task_priority: 'NONE',
        hs_queue_membership_ids: 22152388,
        hs_task_body: `
        ${name} has expressed interest in secondaries at ${new Date().toLocaleString('sv-se')}.

        Interested in:
        * Buying: ${buy ? 'Yes' : 'No'}
        * Selling: ${sell ? 'Yes' : 'No'}

        Profile: 
         * Investing for: ${investingFor} - ${investingFor === 'myself' ? personNumber : `${organizationNumber} ${organizationName}`}
         * Name: ${name}
         * Phone: ${phone}
         * Email: ${email}
      `
      },
      associations: [
        {
          to: {
            id: hubspotId
          },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 204
            }
          ]
        }
      ]
    })
  })

  if (!result.ok) return Response.json({message: 'Could not create task'}, {status: 400})

  return Response.json(true)
}
