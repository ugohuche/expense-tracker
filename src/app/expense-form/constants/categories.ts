import { ExpenseCategory } from "../../../generated/prisma/enums";

export type Category = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export interface CategoryOption {
  value: Category;
  label: string;
  emoji: string;
  tint: string;
}

const CATEGORY_DISPLAY: Record<Category, Omit<CategoryOption, "value">> = {
  FOOD: { label: "Food", emoji: "🍔", tint: "orange.100" },
  INTERNET: { label: "Internet", emoji: "🌐", tint: "blue.100" },
  DRINKS: { label: "Drinks", emoji: "🍷", tint: "rose.100" },
  TRANSPORT: { label: "Transport", emoji: "🚌", tint: "teal.100" },
  RENT: { label: "Rent", emoji: "🏠", tint: "yellow.100" },
  UTILITIES: { label: "Utilities", emoji: "💡", tint: "yellow.100" },
  HEALTH: { label: "Health", emoji: "🩺", tint: "green.100" },
  ENTERTAINMENT: { label: "Entertainment", emoji: "🎬", tint: "purple.100" },
  SHOPPING: { label: "Shopping", emoji: "🛍️", tint: "pink.100" },
  OTHER: { label: "Other", emoji: "📦", tint: "gray.100" },
};

export const CATEGORY_OPTIONS: readonly CategoryOption[] = Object.values(
  ExpenseCategory,
).map((value) => ({ value, ...CATEGORY_DISPLAY[value] }));
