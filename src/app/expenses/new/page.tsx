import type { Metadata } from "next";
import { connection } from "next/server";

import { getAccountCurrency } from "@/lib/expenses";
import { getCurrentUser } from "@/lib/session";

import { ExpenseEditor } from "../components/expense-editor";

export const metadata: Metadata = {
  title: "Add expense | Expense Tracker",
  description: "Record a new expense.",
};

export const instant = false;

export default async function NewExpensePage() {
  await connection();

  const user = await getCurrentUser();
  const currency = await getAccountCurrency(user.id);

  return <ExpenseEditor defaultCurrency={currency} />;
}
