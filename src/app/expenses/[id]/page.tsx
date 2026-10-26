import type { Metadata } from "next";
import { Suspense } from "react";

import {
  ExpenseEditor,
  ExpenseEditorLoading,
} from "../components/expense-editor";

export const metadata: Metadata = {
  title: "Expense | Expense Tracker",
  description: "View or edit an expense saved in this browser.",
};

interface ExpenseDetailContentProps {
  params: PageProps<"/expenses/[id]">["params"];
}

async function ExpenseDetailContent({ params }: ExpenseDetailContentProps) {
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
