'use server'

const getToken = async () => {
  const data = {
    client_id: process.env.BOLAGSVERKET_CLIENT_ID!,
    client_secret: process.env.BOLAGSVERKET_CLIENT_SECRET!,
    grant_type: 'client_credentials',
    scope: 'vardefulla-datamangder:read vardefulla-datamangder:ping'
  }

  const response = await fetch('https://portal.api.bolagsverket.se/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data)
  })

  const result = await response.json()

  return result.access_token
}

export const getOrganizationInfo = async (organizationNumber?: string) => {
  const formattedOrganizationNumber = organizationNumber?.replace('-', '')
  const legalOrganizationNumber = formattedOrganizationNumber?.length === 10
  if (!legalOrganizationNumber) return

  const token = await getToken()

  const response = await fetch('https://gw.api.bolagsverket.se/vardefulla-datamangder/v1/organisationer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      identitetsbeteckning: formattedOrganizationNumber
    })
  })

  const result = await response.json()

  return result?.organisationer?.[0]
}
