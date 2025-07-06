/**
 * Date function schemas using JSON Schema
 */

import { createParameter, createFunctionSchema, createLibrarySchema } from './utils.js'

// Create date function schemas using the helper utilities
export const dateFunctionSchemas = {
  now: createFunctionSchema(
    'now',
    'Returns the current timestamp in milliseconds',
    'date',
    [],
    { type: 'number', description: 'The current timestamp in milliseconds since epoch' },
    {
      examples: ['now() // 1640995200000', 'now() // Current timestamp'],
    }
  ),

  dateCreate: createFunctionSchema(
    'dateCreate',
    'Creates a new Date object',
    'date',
    [createParameter('value', 'Date string, timestamp, or Date object (optional)', { type: 'object' }, false)],
    { type: 'object', description: 'A new Date object' },
    {
      examples: [
        'dateCreate() // Current date',
        'dateCreate("2023-01-01") // 2023-01-01T00:00:00.000Z',
        'dateCreate(1640995200000) // Date from timestamp',
      ],
    }
  ),

  dateFormat: createFunctionSchema(
    'dateFormat',
    'Formats a date according to a format string',
    'date',
    [
      createParameter('date', 'The date to format', { type: 'object' }),
      createParameter('format', 'The format string', { type: 'string' }),
    ],
    { type: 'string', description: 'The formatted date string' },
    {
      examples: [
        'dateFormat(new Date(), "YYYY-MM-DD") // "2023-01-01"',
        'dateFormat("2023-01-01", "DD/MM/YYYY") // "01/01/2023"',
      ],
    }
  ),

  dateParse: createFunctionSchema(
    'dateParse',
    'Parses a date string into a Date object',
    'date',
    [createParameter('dateString', 'The date string to parse', { type: 'string' })],
    { type: 'object', description: 'The parsed Date object' },
    {
      examples: ['dateParse("2023-01-01") // Date object', 'dateParse("Jan 1, 2023") // Date object'],
    }
  ),

  dateAdd: createFunctionSchema(
    'dateAdd',
    'Adds a specified time interval to a date',
    'date',
    [
      createParameter('date', 'The date to add to', { type: 'object' }),
      createParameter('value', 'The amount to add', { type: 'number' }),
      createParameter('unit', 'The unit of time (years, months, days, hours, minutes, seconds)', { type: 'string' }),
    ],
    { type: 'object', description: 'A new Date object with the added time' },
    {
      examples: ['dateAdd(new Date(), 1, "days") // Tomorrow', 'dateAdd("2023-01-01", 1, "months") // 2023-02-01'],
    }
  ),

  dateSubtract: createFunctionSchema(
    'dateSubtract',
    'Subtracts a specified time interval from a date',
    'date',
    [
      createParameter('date', 'The date to subtract from', { type: 'object' }),
      createParameter('value', 'The amount to subtract', { type: 'number' }),
      createParameter('unit', 'The unit of time (years, months, days, hours, minutes, seconds)', { type: 'string' }),
    ],
    { type: 'object', description: 'A new Date object with the subtracted time' },
    {
      examples: [
        'dateSubtract(new Date(), 1, "days") // Yesterday',
        'dateSubtract("2023-01-01", 1, "months") // 2022-12-01',
      ],
    }
  ),

  dateDiff: createFunctionSchema(
    'dateDiff',
    'Calculates the difference between two dates in a specified unit',
    'date',
    [
      createParameter('date1', 'The first date', { type: 'object' }),
      createParameter('date2', 'The second date', { type: 'object' }),
      createParameter('unit', 'The unit to return the difference in (years, months, days, hours, minutes, seconds)', {
        type: 'string',
      }),
    ],
    { type: 'number', description: 'The difference between the dates in the specified unit' },
    {
      examples: [
        'dateDiff("2023-01-01", "2023-01-02", "days") // 1',
        'dateDiff("2023-01-01", "2024-01-01", "years") // 1',
      ],
    }
  ),

  dateStartOf: createFunctionSchema(
    'dateStartOf',
    'Returns the start of a time period for a given date',
    'date',
    [
      createParameter('date', 'The date', { type: 'object' }),
      createParameter('unit', 'The unit of time (year, month, day, hour, minute, second)', { type: 'string' }),
    ],
    { type: 'object', description: 'A new Date object at the start of the specified time period' },
    {
      examples: [
        'dateStartOf("2023-01-15", "month") // 2023-01-01T00:00:00.000Z',
        'dateStartOf("2023-01-15", "day") // 2023-01-15T00:00:00.000Z',
      ],
    }
  ),

  dateEndOf: createFunctionSchema(
    'dateEndOf',
    'Returns the end of a time period for a given date',
    'date',
    [
      createParameter('date', 'The date', { type: 'object' }),
      createParameter('unit', 'The unit of time (year, month, day, hour, minute, second)', { type: 'string' }),
    ],
    { type: 'object', description: 'A new Date object at the end of the specified time period' },
    {
      examples: [
        'dateEndOf("2023-01-15", "month") // 2023-01-31T23:59:59.999Z',
        'dateEndOf("2023-01-15", "day") // 2023-01-15T23:59:59.999Z',
      ],
    }
  ),

  dateIsValid: createFunctionSchema(
    'dateIsValid',
    'Checks if a date value is valid',
    'date',
    [createParameter('date', 'The date to validate', { type: 'object' })],
    { type: 'boolean', description: 'True if the date is valid, false otherwise' },
    {
      examples: [
        'dateIsValid("2023-01-01") // true',
        'dateIsValid("invalid") // false',
        'dateIsValid(new Date()) // true',
      ],
    }
  ),

  dateIsBefore: createFunctionSchema(
    'dateIsBefore',
    'Checks if the first date is before the second date',
    'date',
    [
      createParameter('date1', 'The first date', { type: 'object' }),
      createParameter('date2', 'The second date', { type: 'object' }),
    ],
    { type: 'boolean', description: 'True if date1 is before date2, false otherwise' },
    {
      examples: [
        'dateIsBefore("2023-01-01", "2023-01-02") // true',
        'dateIsBefore("2023-01-02", "2023-01-01") // false',
      ],
    }
  ),

  dateIsAfter: createFunctionSchema(
    'dateIsAfter',
    'Checks if the first date is after the second date',
    'date',
    [
      createParameter('date1', 'The first date', { type: 'object' }),
      createParameter('date2', 'The second date', { type: 'object' }),
    ],
    { type: 'boolean', description: 'True if date1 is after date2, false otherwise' },
    {
      examples: ['dateIsAfter("2023-01-02", "2023-01-01") // true', 'dateIsAfter("2023-01-01", "2023-01-02") // false'],
    }
  ),

  dateIsSame: createFunctionSchema(
    'dateIsSame',
    'Checks if two dates are the same',
    'date',
    [
      createParameter('date1', 'The first date', { type: 'object' }),
      createParameter('date2', 'The second date', { type: 'object' }),
      createParameter('unit', 'The unit to compare (optional)', { type: 'string' }, false),
    ],
    { type: 'boolean', description: 'True if the dates are the same, false otherwise' },
    {
      examples: [
        'dateIsSame("2023-01-01", "2023-01-01") // true',
        'dateIsSame("2023-01-01T12:00:00", "2023-01-01T13:00:00", "day") // true',
      ],
    }
  ),

  dateIsBetween: createFunctionSchema(
    'dateIsBetween',
    'Checks if a date is between two other dates',
    'date',
    [
      createParameter('date', 'The date to check', { type: 'object' }),
      createParameter('startDate', 'The start date', { type: 'object' }),
      createParameter('endDate', 'The end date', { type: 'object' }),
    ],
    { type: 'boolean', description: 'True if the date is between startDate and endDate, false otherwise' },
    {
      examples: [
        'dateIsBetween("2023-01-02", "2023-01-01", "2023-01-03") // true',
        'dateIsBetween("2023-01-04", "2023-01-01", "2023-01-03") // false',
      ],
    }
  ),

  dateGetYear: createFunctionSchema(
    'dateGetYear',
    'Gets the year from a date',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The year' },
    {
      examples: ['dateGetYear("2023-01-01") // 2023', 'dateGetYear(new Date()) // Current year'],
    }
  ),

  dateGetMonth: createFunctionSchema(
    'dateGetMonth',
    'Gets the month from a date (1-12)',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The month (1-12)' },
    {
      examples: ['dateGetMonth("2023-01-01") // 1', 'dateGetMonth("2023-12-01") // 12'],
    }
  ),

  dateGetDay: createFunctionSchema(
    'dateGetDay',
    'Gets the day of the month from a date',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The day of the month' },
    {
      examples: ['dateGetDay("2023-01-15") // 15', 'dateGetDay("2023-12-31") // 31'],
    }
  ),

  dateGetDayOfWeek: createFunctionSchema(
    'dateGetDayOfWeek',
    'Gets the day of the week from a date (0-6, Sunday=0)',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The day of the week (0-6, Sunday=0)' },
    {
      examples: ['dateGetDayOfWeek("2023-01-01") // 0 (Sunday)', 'dateGetDayOfWeek("2023-01-02") // 1 (Monday)'],
    }
  ),

  dateGetHour: createFunctionSchema(
    'dateGetHour',
    'Gets the hour from a date (0-23)',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The hour (0-23)' },
    {
      examples: ['dateGetHour("2023-01-01T12:00:00") // 12', 'dateGetHour("2023-01-01T00:00:00") // 0'],
    }
  ),

  dateGetMinute: createFunctionSchema(
    'dateGetMinute',
    'Gets the minute from a date (0-59)',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The minute (0-59)' },
    {
      examples: ['dateGetMinute("2023-01-01T12:30:00") // 30', 'dateGetMinute("2023-01-01T12:00:00") // 0'],
    }
  ),

  dateGetSecond: createFunctionSchema(
    'dateGetSecond',
    'Gets the second from a date (0-59)',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The second (0-59)' },
    {
      examples: ['dateGetSecond("2023-01-01T12:30:45") // 45', 'dateGetSecond("2023-01-01T12:30:00") // 0'],
    }
  ),

  dateGetTime: createFunctionSchema(
    'dateGetTime',
    'Gets the timestamp in milliseconds from a date',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'number', description: 'The timestamp in milliseconds' },
    {
      examples: ['dateGetTime("2023-01-01") // 1672531200000', 'dateGetTime(new Date()) // Current timestamp'],
    }
  ),

  dateToISOString: createFunctionSchema(
    'dateToISOString',
    'Converts a date to an ISO string',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'string', description: 'The ISO string representation of the date' },
    {
      examples: [
        'dateToISOString("2023-01-01") // "2023-01-01T00:00:00.000Z"',
        'dateToISOString(new Date()) // ISO string',
      ],
    }
  ),

  dateToDateString: createFunctionSchema(
    'dateToDateString',
    'Converts a date to a date string',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'string', description: 'The date string representation' },
    {
      examples: [
        'dateToDateString("2023-01-01") // "Sun Jan 01 2023"',
        'dateToDateString(new Date()) // Current date string',
      ],
    }
  ),

  dateToTimeString: createFunctionSchema(
    'dateToTimeString',
    'Converts a date to a time string',
    'date',
    [createParameter('date', 'The date', { type: 'object' })],
    { type: 'string', description: 'The time string representation' },
    {
      examples: [
        'dateToTimeString("2023-01-01T12:30:45") // "12:30:45 GMT+0000 (UTC)"',
        'dateToTimeString(new Date()) // Current time string',
      ],
    }
  ),

  dateToLocaleString: createFunctionSchema(
    'dateToLocaleString',
    'Converts a date to a locale-specific string',
    'date',
    [
      createParameter('date', 'The date', { type: 'object' }),
      createParameter('locale', 'The locale (optional)', { type: 'string' }, false),
      createParameter('options', 'Formatting options (optional)', { type: 'object' }, false),
    ],
    { type: 'string', description: 'The locale-specific string representation' },
    {
      examples: [
        'dateToLocaleString("2023-01-01") // "1/1/2023, 12:00:00 AM"',
        'dateToLocaleString("2023-01-01", "en-GB") // "01/01/2023, 00:00:00"',
      ],
    }
  ),

  dateSetYear: createFunctionSchema(
    'dateSetYear',
    'Sets the year of a date',
    'date',
    [
      createParameter('date', 'The date', { type: 'object' }),
      createParameter('year', 'The year to set', { type: 'number' }),
    ],
    { type: 'object', description: 'A new Date object with the year set' },
    {
      examples: [
        'dateSetYear("2023-01-01", 2024) // 2024-01-01',
        'dateSetYear(new Date(), 2025) // Date with year 2025',
      ],
    }
  ),

  dateSetMonth: createFunctionSchema(
    'dateSetMonth',
    'Sets the month of a date',
    'date',
    [
      createParameter('date', 'The date', { type: 'object' }),
      createParameter('month', 'The month to set (1-12)', { type: 'number' }),
    ],
    { type: 'object', description: 'A new Date object with the month set' },
    {
      examples: ['dateSetMonth("2023-01-01", 6) // 2023-06-01', 'dateSetMonth(new Date(), 12) // Date with month 12'],
    }
  ),

  dateSetDay: createFunctionSchema(
    'dateSetDay',
    'Sets the day of the month of a date',
    'date',
    [
      createParameter('date', 'The date', { type: 'object' }),
      createParameter('day', 'The day to set', { type: 'number' }),
    ],
    { type: 'object', description: 'A new Date object with the day set' },
    {
      examples: ['dateSetDay("2023-01-01", 15) // 2023-01-15', 'dateSetDay(new Date(), 1) // Date with day 1'],
    }
  ),
}

// Create the library schema
export const dateLibrarySchema = createLibrarySchema(dateFunctionSchemas, {
  category: 'date',
  title: 'Jexl Date Functions',
  description: 'Date manipulation and utility functions for Jexl expressions',
  version: '1.0.0',
})

// Export utility functions for easy access
export const getDateFunction = (name: string) => dateLibrarySchema.functions[name]
export const getDateFunctionNames = () => Object.keys(dateLibrarySchema.functions)
export const getDateFunctionCount = () => Object.keys(dateLibrarySchema.functions).length

// Export for integration with editors/tools
export { dateLibrarySchema as schema }
export default dateLibrarySchema
