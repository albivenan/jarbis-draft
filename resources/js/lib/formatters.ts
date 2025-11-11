export function formatCurrency(amount: string | number, currency: string = 'IDR', locale: string = 'id-ID'): string {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericAmount);
}
