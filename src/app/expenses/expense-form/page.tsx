import { ExpenseForm } from "./components/expense-form";

export default function ExpenseFormPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gray-100 p-6 dark:bg-black">
      <ExpenseForm />
    </main>
  );
}
