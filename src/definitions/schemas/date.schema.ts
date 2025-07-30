/**
 * Date function schemas using JSON Schema
 */

import { createParameter, createFunctionSchema, createLibrarySchema } from './utils.js'

// Create date function schemas using the helper utilities
export const dateFunctionSchemas = {
  NOW: createFunctionSchema(
    'NOW',
    'Returns the current timestamp in milliseconds',
    'date',
    [],
    { type: 'number', description: 'The current timestamp in milliseconds since epoch' },
    {
      examples: ['NOW() // 1640995200000', 'NOW() // Current timestamp'],
    }
  ),

  ADD_DAYS: createFunctionSchema(
    'ADD_DAYS',
    'Adds a specified number of days to a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('days', { type: 'integer', description: 'Number of days to add' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: [
        'ADD_DAYS("2023-01-01T00:00:00Z", 5) // "2023-01-06T00:00:00Z"',
        'ADD_DAYS("2023-01-01T00:00:00Z", -5) // "2022-12-27T00:00:00Z"',
      ],
    }
  ),

  FORMAT_SHORT: createFunctionSchema(
    'FORMAT_SHORT',
    'Formats a date as a short date string',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter('locale', { type: 'string', default: 'en-US', description: 'Locale for formatting' }, false),
    ],
    { type: 'string', description: 'The formatted short date string' },
    {
      examples: [
        'FORMAT_SHORT("2023-01-01T00:00:00Z") // "1/1/2023"',
        'FORMAT_SHORT("2023-01-01T00:00:00Z", "fr-FR") // "01/01/2023"',
      ],
    }
  ),

  FORMAT_MEDIUM: createFunctionSchema(
    'FORMAT_MEDIUM',
    'Formats a date as a medium date string',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter('locale', { type: 'string', default: 'en-US', description: 'Locale for formatting' }, false),
    ],
    { type: 'string', description: 'The formatted medium date string' },
    {
      examples: [
        'FORMAT_MEDIUM("2023-01-01T00:00:00Z") // "Jan 1, 2023"',
        'FORMAT_MEDIUM("2023-01-01T00:00:00Z", "fr-FR") // "1 janv. 2023"',
      ],
    }
  ),
  FORMAT_LONG: createFunctionSchema(
    'FORMAT_LONG',
    'Formats a date as a long date string',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter('locale', { type: 'string', default: 'en-US', description: 'Locale for formatting' }, false),
    ],
    { type: 'string', description: 'The formatted long date string' },
    {
      examples: [
        'FORMAT_LONG("2023-01-01T00:00:00Z") // "January 1, 2023"',
        'FORMAT_LONG("2023-01-01T00:00:00Z", "fr-FR") // "1 janvier 2023"',
      ],
    }
  ),

  FORMAT_FULL: createFunctionSchema(
    'FORMAT_FULL',
    'Formats a date as a full date string',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter('locale', { type: 'string', default: 'en-US', description: 'Locale for formatting' }, false),
    ],
    { type: 'string', description: 'The formatted full date string' },
    {
      examples: [
        'FORMAT_FULL("2023-01-01T00:00:00Z") // "Sunday, January 1, 2023"',
        'FORMAT_FULL("2023-01-01T00:00:00Z", "fr-FR") // "dimanche 1 janvier 2023"',
      ],
    }
  ),

  FORMAT_TIME_SHORT: createFunctionSchema(
    'FORMAT_TIME_SHORT',
    'Formats a date as a short time string',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter('locale', { type: 'string', default: 'en-US', description: 'Locale for formatting' }, false),
    ],
    { type: 'string', description: 'The formatted short time string' },
    {
      examples: [
        'FORMAT_TIME_SHORT("2023-01-01T00:00:00Z") // "12:00 AM"',
        'FORMAT_TIME_SHORT("2023-01-01T00:00:00Z", "fr-FR") // "00:00"',
      ],
    }
  ),

  FORMAT_TIME_MEDIUM: createFunctionSchema(
    'FORMAT_TIME_MEDIUM',
    'Formats a date as a medium time string',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter('locale', { type: 'string', default: 'en-US', description: 'Locale for formatting' }, false),
    ],
    { type: 'string', description: 'The formatted medium time string' },
    {
      examples: [
        'FORMAT_TIME_MEDIUM("2023-01-01T00:00:00Z") // "12:00:00 AM"',
        'FORMAT_TIME_MEDIUM("2023-01-01T00:00:00Z", "fr-FR") // "00:00:00"',
      ],
    }
  ),

  FORMAT_TIME_LONG: createFunctionSchema(
    'FORMAT_TIME_LONG',
    'Formats a date as a long time string',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter('locale', { type: 'string', default: 'en-US', description: 'Locale for formatting' }, false),
    ],
    { type: 'string', description: 'The formatted long time string' },
    {
      examples: [
        'FORMAT_TIME_LONG("2023-01-01T00:00:00Z") // "12:00:00 AM GMT"',
        'FORMAT_TIME_LONG("2023-01-01T00:00:00Z", "fr-FR") // "00:00:00 GMT"',
      ],
    }
  ),

  FORMAT_DATE_TIME: createFunctionSchema(
    'FORMAT_DATE_TIME',
    'Formats a date and time together',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to format' }),
      createParameter(
        'dateStyle',
        {
          type: 'string',
          enum: ['short', 'medium', 'long', 'full'],
          default: 'medium',
          description: 'The date style to use',
        },
        false
      ),
      createParameter(
        'timeStyle',
        { type: 'string', enum: ['short', 'medium', 'long'], default: 'short', description: 'The time style to use' },
        false
      ),
      createParameter(
        'locale',
        {
          type: 'string',
          default: 'en-US',
          description: 'The locale to use for formatting (default: "en-US")',
        },
        false
      ),
    ],
    { type: 'string', description: 'The formatted date-time string' },
    {
      examples: [
        'FORMAT_DATE_TIME("2023-01-01T00:00:00Z") // "Jan 1, 2023, 12:00:00 AM"',
        'FORMAT_DATE_TIME("2023-01-01T00:00:00Z", "fr-FR") // "1 janv. 2023, 00:00:00"',
      ],
    }
  ),

  ADD_MONTHS: createFunctionSchema(
    'ADD_MONTHS',
    'Adds a specified number of months to a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('months', { type: 'integer', description: 'Number of months to add' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: ['ADD_MONTHS("2023-01-01T00:00:00Z", 3) // "2023-04-01T00:00:00Z"'],
    }
  ),

  ADD_YEARS: createFunctionSchema(
    'ADD_YEARS',
    'Adds a specified number of years to a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('years', { type: 'integer', description: 'Number of years to add' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: ['ADD_YEARS("2023-01-01T00:00:00Z", 2) // "2025-01-01T00:00:00Z"'],
    }
  ),

  ADD_HOURS: createFunctionSchema(
    'ADD_HOURS',
    'Adds a specified number of hours to a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('hours', { type: 'integer', description: 'Number of hours to add' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: ['ADD_HOURS("2023-01-01T00:00:00Z", 5) // "2023-01-01T05:00:00Z"'],
    }
  ),

  ADD_MINUTES: createFunctionSchema(
    'ADD_MINUTES',
    'Adds a specified number of minutes to a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('minutes', { type: 'integer', description: 'Number of minutes to add' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: ['ADD_MINUTES("2023-01-01T00:00:00Z", 30) // "2023-01-01T00:30:00Z"'],
    }
  ),

  SUBTRACT_DAYS: createFunctionSchema(
    'SUBTRACT_DAYS',
    'Subtracts a specified number of days from a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('days', { type: 'integer', description: 'Number of days to subtract' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: ['SUBTRACT_DAYS("2023-01-01T00:00:00Z", 5) // "2022-12-27T00:00:00Z"'],
    }
  ),

  SUBTRACT_MONTHS: createFunctionSchema(
    'SUBTRACT_MONTHS',
    'Subtracts a specified number of months from a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('months', { type: 'integer', description: 'Number of months to subtract' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: ['SUBTRACT_MONTHS("2023-01-01T00:00:00Z", 3) // "2022-10-01T00:00:00Z"'],
    }
  ),

  SUBTRACT_YEARS: createFunctionSchema(
    'SUBTRACT_YEARS',
    'Subtracts a specified number of years from a date',
    'date',
    [
      createParameter('date', { type: 'string', format: 'date-time', description: 'The date to modify' }),
      createParameter('years', { type: 'integer', description: 'Number of years to subtract' }),
    ],
    { type: 'string', format: 'date-time', description: 'The modified date' },
    {
      examples: ['SUBTRACT_YEARS("2023-01-01T00:00:00Z", 2) // "2021-01-01T00:00:00Z"'],
    }
  ),

  DIFF_DAYS: createFunctionSchema(
    'DIFF_DAYS',
    'Calculates the difference in days between two dates',
    'date',
    [
      createParameter('date1', { type: 'string', format: 'date-time', description: 'The first date' }),
      createParameter('date2', { type: 'string', format: 'date-time', description: 'The second date' }),
    ],
    { type: 'integer', description: 'The difference in days' },
    {
      examples: [
        'DIFF_DAYS("2023-01-01T00:00:00Z", "2023-01-10T00:00:00Z") // 9',
        'DIFF_DAYS("2023-01-10T00:00:00Z", "2023-01-01T00:00:00Z") // -9',
      ],
    }
  ),

  DIFF_HOURS: createFunctionSchema(
    'DIFF_HOURS',
    'Calculates the difference in hours between two dates',
    'date',
    [
      createParameter('date1', { type: 'string', format: 'date-time', description: 'The first date' }),
      createParameter('date2', { type: 'string', format: 'date-time', description: 'The second date' }),
    ],
    { type: 'integer', description: 'The difference in hours' },
    {
      examples: [
        'DIFF_HOURS("2023-01-01T00:00:00Z", "2023-01-02T00:00:00Z") // 24',
        'DIFF_HOURS("2023-01-02T00:00:00Z", "2023-01-01T00:00:00Z") // -24',
      ],
    }
  ),

  DIFF_MINUTES: createFunctionSchema(
    'DIFF_MINUTES',
    'Calculates the difference in minutes between two dates',
    'date',
    [
      createParameter('date1', { type: 'string', format: 'date-time', description: 'The first date' }),
      createParameter('date2', { type: 'string', format: 'date-time', description: 'The second date' }),
    ],
    { type: 'integer', description: 'The difference in minutes' },
    {
      examples: [
        'DIFF_MINUTES("2023-01-01T00:00:00Z", "2023-01-01T01:00:00Z") // 60',
        'DIFF_MINUTES("2023-01-01T01:00:00Z", "2023-01-01T00:00:00Z") // -60',
      ],
    }
  ),

  START_OF_DAY: createFunctionSchema(
    'START_OF_DAY',
    'Returns the start of the day for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The start of the day' },
    {
      examples: [
        'START_OF_DAY("2023-01-01T12:34:56Z") // "2023-01-01T00:00:00Z"',
        'START_OF_DAY("2023-01-01T00:00:00Z") // "2023-01-01T00:00:00Z"',
      ],
    }
  ),

  END_OF_DAY: createFunctionSchema(
    'END_OF_DAY',
    'Returns the end of the day for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The end of the day' },
    {
      examples: [
        'END_OF_DAY("2023-01-01T12:34:56Z") // "2023-01-01T23:59:59Z"',
        'END_OF_DAY("2023-01-01T00:00:00Z") // "2023-01-01T23:59:59Z"',
      ],
    }
  ),

  START_OF_WEEK: createFunctionSchema(
    'START_OF_WEEK',
    'Returns the start of the week for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The start of the week' },
    {
      examples: [
        'START_OF_WEEK("2023-01-15T12:34:56Z") // "2023-01-09T00:00:00Z"',
        'START_OF_WEEK("2023-01-01T00:00:00Z") // "2023-01-02T00:00:00Z"',
      ],
    }
  ),

  END_OF_WEEK: createFunctionSchema(
    'END_OF_WEEK',
    'Returns the end of the week for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The end of the week' },
    {
      examples: [
        'END_OF_WEEK("2023-01-15T12:34:56Z") // "2023-01-15T23:59:59Z"',
        'END_OF_WEEK("2023-01-01T00:00:00Z") // "2023-01-08T23:59:59Z"',
      ],
    }
  ),

  START_OF_MONTH: createFunctionSchema(
    'START_OF_MONTH',
    'Returns the start of the month for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The start of the month' },
    {
      examples: [
        'START_OF_MONTH("2023-01-15T12:34:56Z") // "2023-01-01T00:00:00Z"',
        'START_OF_MONTH("2023-02-01T00:00:00Z") // "2023-02-01T00:00:00Z"',
      ],
    }
  ),

  END_OF_MONTH: createFunctionSchema(
    'END_OF_MONTH',
    'Returns the end of the month for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The end of the month' },
    {
      examples: [
        'END_OF_MONTH("2023-01-15T12:34:56Z") // "2023-01-31T23:59:59Z"',
        'END_OF_MONTH("2023-02-01T00:00:00Z") // "2023-02-28T23:59:59Z"',
      ],
    }
  ),
  START_OF_YEAR: createFunctionSchema(
    'START_OF_YEAR',
    'Returns the start of the year for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The start of the year' },
    {
      examples: [
        'START_OF_YEAR("2023-05-15T12:34:56Z") // "2023-01-01T00:00:00Z"',
        'START_OF_YEAR("2024-01-01T00:00:00Z") // "2024-01-01T00:00:00Z"',
      ],
    }
  ),
  END_OF_YEAR: createFunctionSchema(
    'END_OF_YEAR',
    'Returns the end of the year for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'string', format: 'date-time', description: 'The end of the year' },
    {
      examples: [
        'END_OF_YEAR("2023-05-15T12:34:56Z") // "2023-12-31T23:59:59Z"',
        'END_OF_YEAR("2024-01-01T00:00:00Z") // "2024-12-31T23:59:59Z"',
      ],
    }
  ),

  IS_WEEKEND: createFunctionSchema(
    'IS_WEEKEND',
    'Checks if a date falls on a weekend (Saturday or Sunday)',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to check' })],
    { type: 'boolean', description: 'True if the date is a weekend, false otherwise' },
    {
      examples: [
        'IS_WEEKEND("2023-01-01T00:00:00Z") // true', // Sunday
        'IS_WEEKEND("2023-01-02T00:00:00Z") // false', // Monday
        'IS_WEEKEND("2023-01-07T00:00:00Z") // true', // Saturday
        'IS_WEEKEND("2023-01-08T00:00:00Z") // true', // Sunday
      ],
    }
  ),

  IS_WEEKDAY: createFunctionSchema(
    'IS_WEEKDAY',
    'Checks if a date falls on a weekday (Monday to Friday)',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to check' })],
    { type: 'boolean', description: 'True if the date is a weekday, false otherwise' },
    {
      examples: [
        'IS_WEEKDAY("2023-01-01T00:00:00Z") // false', // Sunday
        'IS_WEEKDAY("2023-01-02T00:00:00Z") // true', // Monday
        'IS_WEEKDAY("2023-01-07T00:00:00Z") // true', // Saturday
        'IS_WEEKDAY("2023-01-08T00:00:00Z") // false', // Sunday
      ],
    }
  ),

  IS_LEAP_YEAR: createFunctionSchema(
    'IS_LEAP_YEAR',
    'Checks if a given year is a leap year',
    'date',
    [createParameter('year', { type: 'integer', description: 'The year to check' })],
    { type: 'boolean', description: 'True if the year is a leap year, false otherwise' },
    {
      examples: [
        'IS_LEAP_YEAR(2020) // true', // 2020 is a leap year
        'IS_LEAP_YEAR(2021) // false', // 2021 is not a leap year
        'IS_LEAP_YEAR(2024) // true', // 2024 is a leap year
        'IS_LEAP_YEAR(1900) // false', // 1900 is not a leap year (divisible by 100 but not by 400)
        'IS_LEAP_YEAR(2000) // true', // 2000 is a leap year (divisible by 400)
      ],
    }
  ),

  DAYS_IN_MONTH: createFunctionSchema(
    'DAYS_IN_MONTH',
    'Returns the number of days in a given month of a year',
    'date',
    [
      createParameter('year', { type: 'integer', description: 'The year' }),
      createParameter('month', { type: 'integer', description: 'The month (1-12)' }),
    ],
    { type: 'integer', description: 'The number of days in the month' },
    {
      examples: [
        'DAYS_IN_MONTH(2023, 1) // 31', // January
        'DAYS_IN_MONTH(2023, 2) // 28', // February
        'DAYS_IN_MONTH(2024, 2) // 29', // February
        'DAYS_IN_MONTH(2023, 3) // 31', // March
        'DAYS_IN_MONTH(2023, 4) // 30', // April
      ],
    }
  ),

  DAY_OF_YEAR: createFunctionSchema(
    'DAY_OF_YEAR',
    'Returns the day of the year for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'integer', description: 'The day of the year (1-366)' },
    {
      examples: [
        'DAY_OF_YEAR("2023-01-01T00:00:00Z") // 1', // January 1st
        'DAY_OF_YEAR("2023-12-31T00:00:00Z") // 365', // December 31st
        'DAY_OF_YEAR("2024-02-29T00:00:00Z") // 60', // February 29th in a leap year
        'DAY_OF_YEAR("2024-03-01T00:00:00Z") // 61', // March 1st in a leap year
      ],
    }
  ),

  WEEK_OF_YEAR: createFunctionSchema(
    'WEEK_OF_YEAR',
    'Returns the week number of the year for a given date',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to process' })],
    { type: 'integer', description: 'The week number of the year (1-53)' },
    {
      examples: [
        'WEEK_OF_YEAR("2023-01-01T00:00:00Z") // 52', // Last week of 2022
        'WEEK_OF_YEAR("2023-01-02T00:00:00Z") // 1', // First week of 2023
        'WEEK_OF_YEAR("2023-12-31T00:00:00Z") // 52', // Last week of 2023
      ],
    }
  ),

  IS_SAME_DAY: createFunctionSchema(
    'IS_SAME_DAY',
    'Checks if two dates fall on the same calendar day',
    'date',
    [
      createParameter('date1', { type: 'string', format: 'date-time', description: 'The first date' }),
      createParameter('date2', { type: 'string', format: 'date-time', description: 'The second date' }),
    ],
    { type: 'boolean', description: 'True if both dates are the same day, false otherwise' },
    {
      examples: [
        'IS_SAME_DAY("2023-01-01T00:00:00Z", "2023-01-01T23:59:59Z") // true',
        'IS_SAME_DAY("2023-01-01T00:00:00Z", "2023-01-02T00:00:00Z") // false',
      ],
    }
  ),

  IS_TODAY: createFunctionSchema(
    'IS_TODAY',
    'Checks if a given date is today',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to check' })],
    { type: 'boolean', description: 'True if the date is today, false otherwise' },
    {
      examples: [
        'IS_TODAY("2023-01-01T00:00:00Z") // false', // Assuming today is not Jan 1, 2023
        'IS_TODAY("2023-01-02T00:00:00Z") // true', // Assuming today is Jan 2, 2023
        'IS_TODAY("2023-01-03T00:00:00Z") // false', // Assuming today is not Jan 3, 2023
      ],
    }
  ),
  IS_YESTERDAY: createFunctionSchema(
    'IS_YESTERDAY',
    'Checks if a given date is yesterday',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to check' })],
    { type: 'boolean', description: 'True if the date is yesterday, false otherwise' },
    {
      examples: [
        'IS_YESTERDAY("2023-01-01T00:00:00Z") // false', // Assuming today is not Jan 2, 2023
        'IS_YESTERDAY("2023-01-02T00:00:00Z") // true', // Assuming today is Jan 2, 2023
        'IS_YESTERDAY("2023-01-03T00:00:00Z") // false', // Assuming today is not Jan 3, 2023
      ],
    }
  ),
  IS_TOMORROW: createFunctionSchema(
    'IS_TOMORROW',
    'Checks if a given date is tomorrow',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to check' })],
    { type: 'boolean', description: 'True if the date is tomorrow, false otherwise' },
    {
      examples: [
        'IS_TOMORROW("2023-01-01T00:00:00Z") // false', // Assuming today is not Jan 1, 2023
        'IS_TOMORROW("2023-01-02T00:00:00Z") // false', // Assuming today is Jan 2, 2023
        'IS_TOMORROW("2023-01-03T00:00:00Z") // true', // Assuming today is Jan 2, 2023
      ],
    }
  ),

  PARSE_ISO_DATE: createFunctionSchema(
    'PARSE_ISO_DATE',
    'Parses an ISO date string into a date object',
    'date',
    [createParameter('isoDate', { type: 'string', format: 'date-time', description: 'The ISO date string to parse' })],
    { type: 'string', format: 'date-time', description: 'The parsed date in ISO format' },
    {
      examples: [
        'PARSE_ISO_DATE("2023-01-01T00:00:00Z") // "2023-01-01T00:00:00Z"',
        'PARSE_ISO_DATE("2024-02-29T00:00:00Z") // "2024-02-29T00:00:00Z"', // Leap year date
        'PARSE_ISO_DATE("2023-12-31T23:59:59Z") // "2023-12-31T23:59:59Z"',
      ],
    }
  ),

  TO_ISO_DATE: createFunctionSchema(
    'TO_ISO_DATE',
    'Converts a date object to an ISO date string',
    'date',
    [createParameter('date', { type: 'string', format: 'date-time', description: 'The date to convert' })],
    { type: 'string', format: 'date-time', description: 'The date in ISO format' },
    {
      examples: [
        'TO_ISO_DATE("2023-01-01T00:00:00Z") // "2023-01-01T00:00:00Z"',
        'TO_ISO_DATE("2024-02-29T00:00:00Z") // "2024-02-29T00:00:00Z"', // Leap year date
        'TO_ISO_DATE("2023-12-31T23:59:59Z") // "2023-12-31T23:59:59Z"',
      ],
    }
  ),

  GET_AGE: createFunctionSchema(
    'GET_AGE',
    'Calculates the age in years from a given date',
    'date',
    [
      createParameter('birthDate', {
        type: 'string',
        format: 'date-time',
        description: 'The birth date to calculate age from',
      }),
    ],
    { type: 'integer', description: 'The age in years' },
    {
      examples: [
        'GET_AGE("2000-01-01T00:00:00Z") // 23', // Assuming current date is 2023-01-01
        'GET_AGE("1990-05-15T00:00:00Z") // 32', // Assuming current date is 2023-01-01
        'GET_AGE("2023-01-01T00:00:00Z") // 0',
      ],
    }
  ),
}

// Create the library schema
export const dateLibrarySchema = createLibrarySchema(dateFunctionSchemas, {
  category: 'date',
  title: 'Date Functions',
  description: 'Date manipulation and utility functions',
  version: '1.0.0',
})

// Export utility functions for easy access
export const getDateFunction = (name: string) => dateLibrarySchema.functions[name]
export const getDateFunctionNames = () => Object.keys(dateLibrarySchema.functions)
export const getDateFunctionCount = () => Object.keys(dateLibrarySchema.functions).length

// Export for integration with editors/tools
export { dateLibrarySchema as schema }
export default dateLibrarySchema
