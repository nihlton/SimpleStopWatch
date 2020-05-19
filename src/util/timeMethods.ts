import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND, ONE_YEAR } from '../constants'

export const parseTime = (milliseconds : number) : Array<number> => {
  const days = Math.trunc((milliseconds % ONE_YEAR) / ONE_DAY)
  const hours = Math.trunc((milliseconds % ONE_DAY) / ONE_HOUR)
  const minutes = Math.trunc((milliseconds % ONE_HOUR) / ONE_MINUTE)
  const seconds = Math.trunc((milliseconds % ONE_MINUTE) / ONE_SECOND)
  const secondTenths = Math.trunc((milliseconds % ONE_SECOND) / 10)
  
  return [ days, hours, minutes, seconds, secondTenths ]
}

export const padSegments = (timeSegments: Array<number>) : string[] => {
  const [ days, hours, minutes, seconds, secondTenths ] = timeSegments.map(seg => seg ? String(seg).padStart(2, '0') : '')
  return [ days, hours, minutes, seconds || '00', secondTenths || '00' ]
}


