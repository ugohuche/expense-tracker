import { CATEGORY_OPTIONS } from "@/app/expenses/expense-form/constants/categories";
import { isCurrency } from "@/app/expenses/expense-form/constants/currencies";

import type { ExpenseRecord } from "./types";

const STORAGE_KEY = "expense-tracker:expenses:v1";
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CATEGORY_VALUES = new Set(CATEGORY_OPTIONS.map((option) => option.value));

function isValidDateKey(value: string): boolean {
  if (!DATE_KEY_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function parseExpenseRecord(value: unknown): ExpenseRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const { id, description, category, amount, expenseDate } = record;

  if (typeof id !== "string" || id.length === 0) {
    return null;
  }

  if (description !== null && typeof description !== "string") {
    return null;
  }

  if (
    typeof category !== "string" ||
    !CATEGORY_VALUES.has(category as ExpenseRecord["category"])
  ) {
    return null;
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  if (typeof expenseDate !== "string" || !isValidDateKey(expenseDate)) {
    return null;
  }

  return {
    id,
    description,
    category: category as ExpenseRecord["category"],
    amount,
    currency: isCurrency(record.currency) ? record.currency : "USD",
    expenseDate,
  };
}

export function loadStoredExpenses(): ExpenseRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(parseExpenseRecord)
      .filter((expense): expense is ExpenseRecord => expense !== null);
  } catch {
    return [];
  }
}

export function saveStoredExpenses(expenses: ExpenseRecord[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}
