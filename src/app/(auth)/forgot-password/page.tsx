import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import {
  Heading,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";

import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password · Expense Tracker",
};

export const instant = false;

export default async function ForgotPasswordPage() {
  await connection();

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Heading as="h1" size="2xl" color="brand.navy">
          Forgot your password?
        </Heading>
        <Text color="brand.slate" fontSize="sm">
          Enter your email and we&apos;ll send you a link to choose a new
          password.
        </Text>
      </Stack>

      <ForgotPasswordForm />

      <Text color="brand.slate" fontSize="sm" textAlign="center">
        Remembered it?{" "}
        <ChakraLink
          asChild
          color="brand.teal"
          fontWeight="medium"
          textDecoration="underline"
        >
          <Link href="/login">Log in</Link>
        </ChakraLink>
      </Text>
    </Stack>
  );
}
