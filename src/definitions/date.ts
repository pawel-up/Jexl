/**
 * Jexl date functions.
 */

export const NOW = () => new Date()

export const ADD_DAYS = (date: Date | string, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

// /**
//  * Formats a date using locale-specific formatting.
//  * @param date - The date to format.
//  * @param locale - The locale to use for formatting (default: 'en-US').
//  * @param options - Additional formatting options.
//  * @returns The formatted date string.
//  */
// export const FORMAT_LOCALE = (date: Date | string, locale = 'en-US', options: Intl.DateTimeFormatOptions = {}) => {
//   return new Intl.DateTimeFormat(locale, options).format(new Date(date))
// }

/**
 * Formats a date as a short date string.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default to the current server locale).
 * @returns The formatted date string.
 */
export const FORMAT_SHORT = (date: Date | string, locale?: string) => {
  return new Date(date).toLocaleDateString(locale, { dateStyle: 'short' })
}

/**
 * Formats a date as a medium date string.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @returns The formatted date string.
 */
export const FORMAT_MEDIUM = (date: Date | string, locale?: string) => {
  return new Date(date).toLocaleDateString(locale, { dateStyle: 'medium' })
}

/**
 * Formats a date as a long date string.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @returns The formatted date string.
 */
export const FORMAT_LONG = (date: Date | string, locale?: string) => {
  return new Date(date).toLocaleDateString(locale, { dateStyle: 'long' })
}

/**
 * Formats a date as a full date string.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @returns The formatted date string.
 */
export const FORMAT_FULL = (date: Date | string, locale?: string) => {
  return new Date(date).toLocaleDateString(locale, { dateStyle: 'full' })
}

/**
 * Formats time as a short time string.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @returns The formatted time string.
 */
export const FORMAT_TIME_SHORT = (date: Date | string, locale?: string) => {
  return new Date(date).toLocaleTimeString(locale, { timeStyle: 'short' })
}

/**
 * Formats time as a medium time string.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @returns The formatted time string.
 */
export const FORMAT_TIME_MEDIUM = (date: Date | string, locale?: string) => {
  return new Date(date).toLocaleTimeString(locale, { timeStyle: 'medium' })
}

/**
 * Formats time as a long time string.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @returns The formatted time string.
 */
export const FORMAT_TIME_LONG = (date: Date | string, locale?: string) => {
  return new Date(date).toLocaleTimeString(locale, { timeStyle: 'long' })
}

/**
 * Formats a date and time together.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'en-US').
 * @param dateStyle - The date style to use.
 * @param timeStyle - The time style to use.
 * @returns The formatted date and time string.
 */
export const FORMAT_DATE_TIME = (
  date: Date | string,
  dateStyle: 'short' | 'medium' | 'long' | 'full' = 'medium',
  timeStyle: 'short' | 'medium' | 'long' | 'full' = 'short',
  locale?: string
) => {
  return new Date(date).toLocaleString(locale, { dateStyle, timeStyle })
}

/**
 * Adds months to a date.
 * @param date - The date to add months to.
 * @param months - The number of months to add.
 * @returns A new date with the months added.
 */
export const ADD_MONTHS = (date: Date | string, months: number) => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

/**
 * Adds years to a date.
 * @param date - The date to add years to.
 * @param years - The number of years to add.
 * @returns A new date with the years added.
 */
export const ADD_YEARS = (date: Date | string, years: number) => {
  const newDate = new Date(date)
  newDate.setFullYear(newDate.getFullYear() + years)
  return newDate
}

/**
 * Adds hours to a date.
 * @param date - The date to add hours to.
 * @param hours - The number of hours to add.
 * @returns A new date with the hours added.
 */
export const ADD_HOURS = (date: Date | string, hours: number) => {
  const newDate = new Date(date)
  newDate.setHours(newDate.getHours() + hours)
  return newDate
}

/**
 * Adds minutes to a date.
 * @param date - The date to add minutes to.
 * @param minutes - The number of minutes to add.
 * @returns A new date with the minutes added.
 */
export const ADD_MINUTES = (date: Date | string, minutes: number) => {
  const newDate = new Date(date)
  newDate.setMinutes(newDate.getMinutes() + minutes)
  return newDate
}

/**
 * Subtracts days from a date.
 * @param date - The date to subtract days from.
 * @param days - The number of days to subtract.
 * @returns A new date with the days subtracted.
 */
export const SUBTRACT_DAYS = (date: Date | string, days: number) => {
  return ADD_DAYS(date, -days)
}

/**
 * Subtracts months from a date.
 * @param date - The date to subtract months from.
 * @param months - The number of months to subtract.
 * @returns A new date with the months subtracted.
 */
export const SUBTRACT_MONTHS = (date: Date | string, months: number) => {
  return ADD_MONTHS(date, -months)
}

/**
 * Subtracts years from a date.
 * @param date - The date to subtract years from.
 * @param years - The number of years to subtract.
 * @returns A new date with the years subtracted.
 */
export const SUBTRACT_YEARS = (date: Date | string, years: number) => {
  return ADD_YEARS(date, -years)
}

/**
 * Gets the difference in days between two dates.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns The difference in days.
 */
export const DIFF_DAYS = (date1: Date | string, date2: Date | string) => {
  const timeDiff = new Date(date2).getTime() - new Date(date1).getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Gets the difference in hours between two dates.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns The difference in hours.
 */
export const DIFF_HOURS = (date1: Date | string, date2: Date | string) => {
  const timeDiff = new Date(date2).getTime() - new Date(date1).getTime()
  return Math.ceil(timeDiff / (1000 * 3600))
}

/**
 * Gets the difference in minutes between two dates.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns The difference in minutes.
 */
export const DIFF_MINUTES = (date1: Date | string, date2: Date | string) => {
  const timeDiff = new Date(date2).getTime() - new Date(date1).getTime()
  return Math.ceil(timeDiff / (1000 * 60))
}

/**
 * Gets the start of the day for a date.
 * @param date - The date to get the start of day for.
 * @returns A new date set to the start of the day.
 */
export const START_OF_DAY = (date: Date | string) => {
  const newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

/**
 * Gets the end of the day for a date.
 * @param date - The date to get the end of day for.
 * @returns A new date set to the end of the day.
 */
export const END_OF_DAY = (date: Date | string) => {
  const newDate = new Date(date)
  newDate.setHours(23, 59, 59, 999)
  return newDate
}

/**
 * Gets the start of the week for a date.
 * @param date - The date to get the start of week for.
 * @returns A new date set to the start of the week (Sunday).
 */
export const START_OF_WEEK = (date: Date | string) => {
  const newDate = new Date(date)
  const day = newDate.getDay()
  const diff = newDate.getDate() - day
  newDate.setDate(diff)
  return START_OF_DAY(newDate)
}

/**
 * Gets the end of the week for a date.
 * @param date - The date to get the end of week for.
 * @returns A new date set to the end of the week (Saturday).
 */
export const END_OF_WEEK = (date: Date | string) => {
  const newDate = new Date(date)
  const day = newDate.getDay()
  const diff = newDate.getDate() - day + 6
  newDate.setDate(diff)
  return END_OF_DAY(newDate)
}

/**
 * Gets the start of the month for a date.
 * @param date - The date to get the start of month for.
 * @returns A new date set to the start of the month.
 */
export const START_OF_MONTH = (date: Date | string) => {
  const newDate = new Date(date)
  newDate.setDate(1)
  return START_OF_DAY(newDate)
}

/**
 * Gets the end of the month for a date.
 * @param date - The date to get the end of month for.
 * @returns A new date set to the end of the month.
 */
export const END_OF_MONTH = (date: Date | string) => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + 1, 0)
  return END_OF_DAY(newDate)
}

/**
 * Gets the start of the year for a date.
 * @param date - The date to get the start of year for.
 * @returns A new date set to the start of the year.
 */
export const START_OF_YEAR = (date: Date | string) => {
  const newDate = new Date(date)
  newDate.setMonth(0, 1)
  return START_OF_DAY(newDate)
}

/**
 * Gets the end of the year for a date.
 * @param date - The date to get the end of year for.
 * @returns A new date set to the end of the year.
 */
export const END_OF_YEAR = (date: Date | string) => {
  const newDate = new Date(date)
  newDate.setMonth(11, 31)
  return END_OF_DAY(newDate)
}

/**
 * Checks if a date is a weekend (Saturday or Sunday).
 * @param date - The date to check.
 * @returns True if the date is a weekend, false otherwise.
 */
export const IS_WEEKEND = (date: Date | string) => {
  const day = new Date(date).getDay()
  return day === 0 || day === 6
}

/**
 * Checks if a date is a weekday (Monday to Friday).
 * @param date - The date to check.
 * @returns True if the date is a weekday, false otherwise.
 */
export const IS_WEEKDAY = (date: Date | string) => {
  return !IS_WEEKEND(date)
}

/**
 * Checks if a year is a leap year.
 * @param year - The year to check.
 * @returns True if the year is a leap year, false otherwise.
 */
export const IS_LEAP_YEAR = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Gets the number of days in a month.
 * @param year - The year.
 * @param month - The month (0-11).
 * @returns The number of days in the month.
 */
export const DAYS_IN_MONTH = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Gets the day of the year for a date.
 * @param date - The date to get the day of year for.
 * @returns The day of the year (1-366).
 */
export const DAY_OF_YEAR = (date: Date | string) => {
  const d = new Date(date)
  const today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  const start = Date.UTC(d.getUTCFullYear(), 0, 1)
  const diff = today - start
  if (!diff) {
    return 1 // the first day
  }
  return diff / 86400000 + 1
}

/**
 * Gets the week number of the year for a date.
 * @param date - The date to get the week number for.
 * @returns The week number (1-53).
 */
export const WEEK_OF_YEAR = (date: Date | string) => {
  // Create a copy of the date to avoid modifying the original
  const d = new Date(date)
  // ISO week date weeks start on Monday, so correct the day number
  const dayNr = (d.getDay() + 6) % 7
  // Set the target to the Thursday of the current week
  d.setDate(d.getDate() - dayNr + 3)
  // ISO 8601 states that week 1 is the week with January 4th in it
  const jan4 = new Date(d.getFullYear(), 0, 4)
  // Calculate the number of days between the target date and January 4th
  const dayDiff = (d.getTime() - jan4.getTime()) / 86400000
  // Calculate the week number
  return 1 + Math.ceil(dayDiff / 7)
}

/**
 * Checks if two dates are the same day.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if the dates are the same day, false otherwise.
 */
export const IS_SAME_DAY = (date1: Date | string, date2: Date | string) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

/**
 * Checks if a date is today.
 * @param date - The date to check.
 * @returns True if the date is today, false otherwise.
 */
export const IS_TODAY = (date: Date | string) => {
  return IS_SAME_DAY(date, new Date())
}

/**
 * Checks if a date is tomorrow.
 * @param date - The date to check.
 * @returns True if the date is tomorrow, false otherwise.
 */
export const IS_TOMORROW = (date: Date | string) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return IS_SAME_DAY(date, tomorrow)
}

/**
 * Checks if a date is yesterday.
 * @param date - The date to check.
 * @returns True if the date is yesterday, false otherwise.
 */
export const IS_YESTERDAY = (date: Date | string) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return IS_SAME_DAY(date, yesterday)
}

/**
 * Parses a date string in ISO format.
 * @param dateString - The date string to parse.
 * @returns The parsed date.
 */
export const PARSE_ISO_DATE = (dateString: string) => {
  return new Date(dateString)
}

/**
 * Converts a date to ISO string.
 * @param date - The date to convert.
 * @returns The ISO string representation.
 */
export const TO_ISO_DATE = (date: Date | string) => {
  return new Date(date).toISOString()
}

/**
 * Gets the age in years from a birth date.
 * @param birthDate - The birth date.
 * @returns The age in years.
 */
export const GET_AGE = (birthDate: Date | string) => {
  const today = new Date()
  const bDate = new Date(birthDate)
  let age = today.getFullYear() - bDate.getFullYear()
  const monthDiff = today.getMonth() - bDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bDate.getDate())) {
    age--
  }

  return age
}
