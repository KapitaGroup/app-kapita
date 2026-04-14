export const noUser400 = () => Response.json({error: 'Please log in!'}, {status: 400})

export const dataNotFound404 = (entity: string) =>
  Response.json({error: `${entity} not found!`}, {status: 404})
export const parameterMissing404 = (paramName: string) =>
  Response.json({error: `${paramName} id parameter is missing!`}, {status: 400})
