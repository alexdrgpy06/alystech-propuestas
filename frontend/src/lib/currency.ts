export function formatUsd(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('en-US');
}

export function formatGs(amountUsd: number, exchangeRate: number): string {
  return Math.round(amountUsd * exchangeRate).toLocaleString('es-PY') + ' Gs';
}
