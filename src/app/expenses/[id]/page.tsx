import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/session";

import {
  ExpenseEditor,
  ExpenseEditorLoading,
} from "../components/expense-editor";

export const metadata: Metadata = {
  title: "Expense | Expense Tracker",
  description: "View or edit an expense saved in this browser.",
};

export const instant = false;

interface ExpenseDetailContentProps {
  params: PageProps<"/expenses/[id]">["params"];
}

async function ExpenseDetailContent({ params }: ExpenseDetailContentProps) {
  await connection();
  await getCurrentUser();

  const { id } = await params;

  return <ExpenseEditor key={id} expenseId={id} />;
}

export default function ExpenseDetailPage({
  params,
}: PageProps<"/expenses/[id]">) {
  return (
    <Suspense fallback={<ExpenseEditorLoading />}>
      <ExpenseDetailContent params={params} />
    </Suspense>
  );
}
