import { connection } from "next/server";

import { getCurrentUser } from "@/lib/session";

import Dashboard from "./dashboard/page";

export const instant = false;

export default async function Home() {
  await connection();
  await getCurrentUser();

  return <Dashboard />;
}
