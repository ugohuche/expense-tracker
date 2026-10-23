"use server";

import bcrypt from "bcryptjs";
import { refresh } from "next/cache";
import * as z from "zod";

import {
  ChangePasswordFormSchema,
  ProfileFormSchema,
  type ChangePasswordFormState,
  type ProfileFormState,
} from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

function toNullable(value: string): string | null {
  return value.length > 0 ? value : null;
}

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser();

  const validatedFields = ProfileFormSchema.safeParse({
    name: formData.get("name"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    avatarUrl: formData.get("avatarUrl"),
    currency: formData.get("currency"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      status: "error",
    };
  }

  const { name, firstName, lastName, avatarUrl, currency } =
    validatedFields.data;

  const profile = {
    firstName: toNullable(firstName),
    lastName: toNullable(lastName),
    avatarUrl: toNullable(avatarUrl),
    currency,
  };

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { name } }),
    prisma.profile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...profile },
      update: profile,
    }),
  ]);

  refresh();

  return { message: "Profile updated.", status: "success" };
}

export async function changePassword(
  _state: ChangePasswordFormState,
  formData: FormData,
): Promise<ChangePasswordFormState> {
  const user = await getCurrentUser();

  const validatedFields = ChangePasswordFormSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      status: "error",
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  if (!account?.passwordHash) {
    return {
      message: "This account does not sign in with a password.",
      status: "error",
    };
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    account.passwordHash,
  );

  if (!passwordMatches) {
    return {
      errors: { currentPassword: ["Current password is incorrect."] },
      status: "error",
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { message: "Password updated.", status: "success" };
}
