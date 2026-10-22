import { DEFAULT_CURRENCY } from "@/lib/currency";
import { prisma } from "@/lib/prisma";

export interface SettingsProfile {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  currency: string;
}

export interface SettingsData {
  name: string;
  email: string;
  createdAt: Date;
  profile: SettingsProfile;
}

export async function getSettingsData(
  userId: string,
): Promise<SettingsData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          avatarUrl: true,
          currency: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    profile: {
      firstName: user.profile?.firstName ?? null,
      lastName: user.profile?.lastName ?? null,
      avatarUrl: user.profile?.avatarUrl ?? null,
      currency: user.profile?.currency ?? DEFAULT_CURRENCY,
    },
  };
}
