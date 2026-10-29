import type { Metadata } from "next";
import { connection } from "next/server";

import { getCurrentUser } from "@/lib/session";

import { ExpensesHistory } from "./components/expenses-history";
import { toLocalDateKey } from "./utils";

export const metadata: Metadata = {
  title: "Expenses | Expense Tracker",
  description: "Review, search, and filter expenses saved in this browser.",
};

export const instant = false;

export default async function ExpensesPage() {
  await connection();
  await getCurrentUser();

  const now = new Date();

  return <ExpensesHistory referenceDate={toLocalDateKey(now)} />;
}
