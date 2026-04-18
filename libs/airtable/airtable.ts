import Airtable from 'airtable'

let _base: ReturnType<typeof Airtable.base> | null = null

const getBase = () => {
  if (!_base) {
    Airtable.configure({apiKey: process.env.AIRTABLE_API_KEY})
    _base = Airtable.base(process.env.AIRTABLE_BASE!)
  }
  return _base
}

export const airtableClient = (table: string) => getBase()(table)
