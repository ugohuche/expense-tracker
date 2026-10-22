import { ExpenseCategory } from "@/generated/prisma/enums";

export type Category = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export interface CategoryOption {
  value: Category;
  label: string;
  emoji: string;
  tint: string;
  color: string;
}

const CATEGORY_DISPLAY: Record<Category, Omit<CategoryOption, "value">> = {
  FOOD: {
    label: "Food",
    emoji: "🍔",
    tint: "orange.100",
    color: "orange.400",
  },
  INTERNET: {
    label: "Internet",
    emoji: "🌐",
    tint: "blue.100",
    color: "blue.400",
  },
  DRINKS: {
    label: "Drinks",
    emoji: "🍷",
    tint: "red.100",
    color: "red.400",
  },
  TRANSPORT: {
    label: "Transport",
    emoji: "🚌",
    tint: "teal.100",
    color: "cyan.500",
  },
  RENT: {
    label: "Rent",
    emoji: "🏠",
    tint: "yellow.100",
    color: "teal.500",
  },
  UTILITIES: {
    label: "Utilities",
    emoji: "💡",
    tint: "yellow.100",
    color: "yellow.400",
  },
  HEALTH: {
    label: "Health",
    emoji: "🩺",
    tint: "green.100",
    color: "green.400",
  },
  ENTERTAINMENT: {
    label: "Entertainment",
    emoji: "🎬",
    tint: "purple.100",
    color: "purple.400",
  },
  SHOPPING: {
    label: "Shopping",
    emoji: "🛍️",
    tint: "pink.100",
    color: "pink.400",
  },
  OTHER: {
    label: "Other",
    emoji: "📦",
    tint: "gray.100",
    color: "gray.400",
  },
};

export const CATEGORY_OPTIONS: readonly CategoryOption[] = Object.values(
  ExpenseCategory,
).map((value) => ({ value, ...CATEGORY_DISPLAY[value] }));

export const CATEGORY_BY_VALUE: Record<Category, CategoryOption> =
  Object.fromEntries(
    CATEGORY_OPTIONS.map((option) => [option.value, option]),
  ) as Record<Category, CategoryOption>;
