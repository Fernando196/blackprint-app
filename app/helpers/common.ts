export const fmtMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

export const fmtN = (n: number) => new Intl.NumberFormat('es-MX').format(n)
