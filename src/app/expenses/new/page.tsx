import type { Metadata } from "next";
import { connection } from "next/server";

import { getCurrentUser } from "@/lib/session";

import { ExpenseEditor } from "../components/expense-editor";

export const metadata: Metadata = {
  title: "Add expense | Expense Tracker",
  description: "Record a new expense in this browser.",
};

export const instant = false;

export default async function NewExpensePage() {
  await connection();
  await getCurrentUser();

  return <ExpenseEditor />;
}
