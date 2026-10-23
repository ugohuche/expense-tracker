import * as z from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    }),
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const ProfileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Display name must be at least 2 characters long." }),
  firstName: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .max(100, { error: "First name must be 100 characters or fewer." }),
  ]),
  lastName: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .max(100, { error: "Last name must be 100 characters or fewer." }),
  ]),
  avatarUrl: z.union([
    z.literal(""),
    z.url({ error: "Please enter a valid image URL." }),
  ]),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, { error: "Currency must be a 3-letter code." }),
});

export type ProfileFormState =
  | {
      errors?: {
        name?: string[];
        firstName?: string[];
        lastName?: string[];
        avatarUrl?: string[];
        currency?: string[];
      };
      message?: string;
      status?: "success" | "error";
    }
  | undefined;

export const ChangePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { error: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { error: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Contain at least one special character.",
      }),
    confirmPassword: z.string().min(1, { error: "Confirm your new password." }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormState =
  | {
      errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      status?: "success" | "error";
    }
  | undefined;
