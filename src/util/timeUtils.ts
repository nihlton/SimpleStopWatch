import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND, ONE_YEAR } from '../constants'

export const parseTime = (milliseconds : number) : Array<number> => {
  // split milliseconds into its constituent time segments
  const days = Math.trunc((milliseconds % ONE_YEAR) / ONE_DAY)
  const hours = Math.trunc((milliseconds % ONE_DAY) / ONE_HOUR)
  const minutes = Math.trunc((milliseconds % ONE_HOUR) / ONE_MINUTE)
  const seconds = Math.trunc((milliseconds % ONE_MINUTE) / ONE_SECOND)
  const secondTenths = Math.trunc((milliseconds % ONE_SECOND) / 10)
  
  return [ days, hours, minutes, seconds, secondTenths ]
}

export const padSegments = (timeSegments: Array<number>) : string[] => {
  // always return values for seconds and second tenths
  const [ days, hours, minutes, seconds, secondTenths ] = timeSegments.map(seg => seg ? String(seg).padStart(2, '0') : '')
  return [ days, hours, minutes, seconds || '00', secondTenths || '00' ]
}

// TODO:  test these
