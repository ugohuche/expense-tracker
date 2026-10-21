import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";

import SignupForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up · Expense Tracker",
};

export default function SignupPage() {
  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Heading as="h1" size="2xl" color="brand.navy">
          Create your account
        </Heading>
        <Text color="brand.slate" fontSize="sm">
          Start tracking your expenses in seconds.
        </Text>
      </Stack>

      <SignupForm />

      <Text color="brand.slate" fontSize="sm" textAlign="center">
        Already have an account?{" "}
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
