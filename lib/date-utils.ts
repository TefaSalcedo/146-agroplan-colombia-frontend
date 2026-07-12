const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseApiDate(value: string): Date {
  const match = DATE_ONLY_PATTERN.exec(value)

  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(year, month - 1, day)

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new Error(`Invalid API date: ${value}`)
    }

    return date
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid API date: ${value}`)
  }

  return date
}

export function formatApiDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
  }).format(parseApiDate(value))
}

export function formatApiMonth(value: string, monthName: string): string {
  return `${monthName} ${parseApiDate(value).getFullYear()}`
}
