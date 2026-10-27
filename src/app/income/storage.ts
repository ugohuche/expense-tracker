import type { IncomeRecord } from "./types";

const STORAGE_KEY = "expense-tracker:incomes:v1";
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateKey(value: string): boolean {
  if (!DATE_KEY_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function parseIncomeRecord(value: unknown): IncomeRecord {
  if (!value || typeof value !== "object") {
    throw new Error("Income storage contains an invalid record.");
  }

  const record = value as Record<string, unknown>;
  const { id, amount, source, description, incomeDate } = record;

  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Income storage contains a record without an ID.");
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Income storage contains an invalid amount.");
  }

  if (source !== null && typeof source !== "string") {
    throw new Error("Income storage contains an invalid source.");
  }

  if (description !== null && typeof description !== "string") {
    throw new Error("Income storage contains an invalid description.");
  }

  if (typeof incomeDate !== "string" || !isValidDateKey(incomeDate)) {
    throw new Error("Income storage contains an invalid date.");
  }

  return { id, amount, source, description, incomeDate };
}

export function loadStoredIncomes(): IncomeRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      "Income storage could not be read because its data is invalid.",
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Income storage could not be read because its data is invalid.",
    );
  }

  return parsed.map(parseIncomeRecord);
}

export function saveStoredIncomes(incomes: IncomeRecord[]): void {
  if (typeof window === "undefined") {
    throw new Error("Income can only be saved in a browser.");
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(incomes));
}
