export type EvaluationPeriod = {
  start: Date
  end: Date
  label: string
}

export function getEvaluationPeriod(): EvaluationPeriod {

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-11

  let start: Date
  let end: Date
  let label: string

  // Jan – Mar
  if (month <= 2) {

    start = new Date(year, 0, 1)
    end = new Date(year, 2, 31)

    label = `Jan – Mar ${year}`

  }

  // Apr – Jun
  else if (month <= 5) {

    start = new Date(year, 3, 1)
    end = new Date(year, 5, 30)

    label = `Apr – Jun ${year}`

  }

  // Jul – Sep
  else if (month <= 8) {

    start = new Date(year, 6, 1)
    end = new Date(year, 8, 30)

    label = `Jul – Sep ${year}`

  }

  // Oct – Dec
  else {

    start = new Date(year, 9, 1)
    end = new Date(year, 11, 31)

    label = `Oct – Dec ${year}`

  }

  return {
    start,
    end,
    label
  }
}