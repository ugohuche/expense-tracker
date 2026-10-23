export const DEFAULT_CURRENCY = "USD";

export interface CurrencyOption {
  value: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "NGN", label: "Nigerian Naira (NGN)" },
  { value: "GHS", label: "Ghanaian Cedi (GHS)" },
  { value: "ZAR", label: "South African Rand (ZAR)" },
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
  { value: "JPY", label: "Japanese Yen (JPY)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "CHF", label: "Swiss Franc (CHF)" },
];
