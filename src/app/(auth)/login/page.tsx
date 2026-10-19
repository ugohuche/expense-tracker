import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Box, Heading, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";

import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in · Expense Tracker",
};

export const instant = false;

export default async function LoginPage() {
  await connection();

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Heading as="h1" size="2xl" color="brand.navy">
          Welcome back
        </Heading>
        <Text color="brand.slate" fontSize="sm">
          Log in to continue tracking your expenses.
        </Text>
      </Stack>

      <Suspense fallback={<Box h="48" />}>
        <LoginForm />
      </Suspense>

      <Text color="brand.slate" fontSize="sm" textAlign="center">
        Don&apos;t have an account?{" "}
        <ChakraLink
          asChild
          color="brand.teal"
          fontWeight="medium"
          textDecoration="underline"
        >
          <Link href="/signup">Sign up</Link>
        </ChakraLink>
      </Text>
    </Stack>
  );
}
