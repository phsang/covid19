import { Country } from '@models/summary/country.model'

export interface Global {
  Global: {
    Date: Date,
    NewConfirmed: number,
    TotalConfirmed: number,
    NewDeaths: number,
    TotalDeaths: number,
    NewRecovered: number,
    TotalRecovered: number
  },
  Countries: Country[]
}