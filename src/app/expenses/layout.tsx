import { connection } from "next/server";

import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/session";

export const instant = false;

export default async function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const user = await getCurrentUser();

  return (
    <>
      <Sidebar displayName={user.name} />
      {children}
    </>
  );
}
