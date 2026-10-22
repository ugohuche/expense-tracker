import { redirect } from "next/navigation";

import { auth } from "@/auth";

export interface CurrentUser {
  id: string;
  name: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    redirect("/login");
  }

  return {
    id: user.id,
    name: user.name ?? user.email ?? "Account",
  };
}
