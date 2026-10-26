import { connection } from "next/server";

import { getCurrentUser } from "@/lib/session";

export const instant = false;

export default async function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  await getCurrentUser();

  return children;
}
