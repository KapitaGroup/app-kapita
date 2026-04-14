'use server'
import Airtable from 'airtable'

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY
})

export const airtableClient = Airtable.base(process.env.AIRTABLE_BASE!)
