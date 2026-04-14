import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {noUser400} from '@/utils/apiResponses'

export const POST = async (request: Request) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const {hubspotId, opportunityName, name, email, phone, investingFor, personNumber, organizationNumber, organizationName} =
    await request.json()

  const result = await fetch('https://api.hubapi.com/crm/v3/objects/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_task_subject: `Opened "${opportunityName}" memorandum on app.kapita.com - ${email}`,
        hs_task_type: 'CALL',
        hs_task_priority: 'NONE',
        hs_task_body: `
        ${email} user has expressed interest in "${opportunityName}" opportunity at ${new Date().toLocaleString('sv-se')}.

        His profile settings: 
         * Investing for: ${investingFor} - ${investingFor === 'myself' ? personNumber : `${organizationNumber} ${organizationName}`}
         * Name: ${name}
         * Phone: ${phone}
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
