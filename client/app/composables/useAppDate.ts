import { useDate } from 'vuetify'

export default function () {
  const dateAdapter = useDate()

  // @see https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
  const removeDateTimezoneOffset = (date: Date) =>
    new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000))

  const parse = (date: string | Date | undefined) =>
    'string' === typeof date
      ? removeDateTimezoneOffset(
          dateAdapter.parseISO(date.slice(0, 10)) as Date,
        )
      : date
  const parseIso = (date: string | Date | undefined) => {
    if ('string' === typeof date) {
      return new Date(date)
    }
    return date
  }

  return {
    dateAdapter,
    parse,
    parseIso,
    removeDateTimezoneOffset,
  }
}
