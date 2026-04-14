export const checkProfileExists = async (body: {
  loginId?: string
  email?: string
}) => {
  const response = await fetch(`/api/profile/exists`, {method: 'PUT', body: JSON.stringify(body)})

  return await response.json()
}
