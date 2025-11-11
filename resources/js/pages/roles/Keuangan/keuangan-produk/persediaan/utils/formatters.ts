export function formatCurrency(amount: string | number | null | undefined, currency: string = 'IDR', locale: string = 'id-ID'): string {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Add defensive check
    if (numericAmount === null || numericAmount === undefined || isNaN(numericAmount)) {
        return 'N/A'; // Or '0' or throw an error, depending on desired behavior
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericAmount);
}