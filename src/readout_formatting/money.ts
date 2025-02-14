const currency_formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    trailingZeroDisplay: "stripIfInteger"
} as any);

export const format_currency = currency_formatter.format;
