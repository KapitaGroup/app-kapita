import {HubspotContactPropertyList} from './lists'

export const fetchHubspotContact = async (email: string) => {
  return await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts/${email}?&idProperty=email&properties=${HubspotContactPropertyList.join(',')}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
      }
    }
  )
}
