import type { Metadata } from "next";

import { ExpenseEditor } from "../components/expense-editor";

export const metadata: Metadata = {
  title: "Add expense | Expense Tracker",
  description: "Record a new expense in this browser.",
};

export default function NewExpensePage() {
  return <ExpenseEditor />;
}
