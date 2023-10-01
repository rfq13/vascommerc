import { format, formatDistance } from 'date-fns'
import { id, enUS } from 'date-fns/locale'

const TZ_ID = { locale: id } // Timezone Indonesia

const formatDate = (
  date: Date | number | string,
  formatType: string = 'dd-MM-yyyy',
) => {
  try {
    return format(new Date(date), formatType, TZ_ID)
  } catch (error) {
    return date
  }
}
const formatHumanize = (date: Date | number, locale = 'id') => {
  let format = { ...TZ_ID }
  if (locale === 'en') format = { locale: enUS }
  try {
    // return format(new Date(date), formatType, TZ_ID)
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
      ...format,
    })
  } catch (error) {
    return date
  }
}

const formatDateTimeText = (date: Date | number | string, _locale = 'id') => {
  let _format = { ...TZ_ID }
  if (_locale === 'en') _format = { locale: enUS }
  return format(new Date(date), 'dd MMMM yyyy HH:mm', { ..._format })
}

const formatDateText = (date: Date | number | string) => {
  return formatDate(date, 'dd MMMM yyyy')
}

const formatDateTime = (date: Date | number | string) => {
  return formatDate(date, 'dd-MM-yyyy HH:mm:ss')
}

const formatDateSystem = (date: Date | number | string) => {
  return formatDate(date, 'yyyy-MM-dd')
}

const formatDateTimeSystem = (date: Date | number | string) => {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss')
}

const formatMonth = (date: Date | number | string) => {
  return formatDate(date, 'MMMM')
}

const formatYear = (date: Date | number | string) => {
  return formatDate(date, 'yyyy')
}

const formatTime = (date: Date | number | string) => {
  return formatDate(date, 'HH:mm')
}

const formatSecondToWeek = (second: number | string) => {
  const week = Number(second || 0) / 60 / 60 / 24 / 7
  if (week < 1) return 1
  return Math.round(week)
}

export {
  formatDate,
  formatDateSystem,
  formatDateTime,
  formatDateTimeSystem,
  formatMonth,
  formatYear,
  formatTime,
  formatSecondToWeek,
  formatDateTimeText,
  formatDateText,
  formatHumanize,
}
