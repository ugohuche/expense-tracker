import { connection } from "next/server";

import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/session";

export const instant = false;

export default async function IncomeLayout({
  children,
}: LayoutProps<"/income">) {
  await connection();
  const user = await getCurrentUser();

  return (
    <>
      <Sidebar displayName={user.name} />
      {children}
    </>
  );
}
