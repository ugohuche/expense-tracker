import type { Metadata } from "next";
import { connection } from "next/server";

import { IncomeHistory } from "./components/income-history";
import { toIncomeDateKey } from "./utils";

export const metadata: Metadata = {
  title: "Income | Expense Tracker",
  description: "Review, search, and filter income saved in this browser.",
};

export const instant = false;

export default async function IncomePage() {
  await connection();

  return <IncomeHistory referenceDate={toIncomeDateKey(new Date())} />;
}
