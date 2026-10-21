import Link from "next/link";
import { connection } from "next/server";
import { Button, Flex, Text } from "@chakra-ui/react";

import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";

const buttonStyles = {
  borderRadius: "full",
  h: 12,
  px: 7,
  fontSize: "sm",
  fontWeight: "medium",
} as const;

export default async function AuthStatus() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return (
      <Flex
        gap={3}
        direction={{ base: "column", sm: "row" }}
        w={{ base: "full", sm: "auto" }}
      >
        <Button
          asChild
          {...buttonStyles}
          bg="brand.teal"
          color="white"
          _hover={{ bg: "brand.teal", opacity: 0.9 }}
        >
          <Link href="/signup">Get started</Link>
        </Button>
        <Button
          asChild
          {...buttonStyles}
          bg="white"
          color="brand.navy"
          borderWidth="1px"
          borderColor="brand.mist"
          _hover={{ bg: "brand.soft-white" }}
        >
          <Link href="/login">Log in</Link>
        </Button>
      </Flex>
    );
  }

  return (
    <Flex align="center" gap={4} direction={{ base: "column", sm: "row" }}>
      <Text fontSize="sm" color="brand.slate">
        Signed in as{" "}
        <Text as="span" fontWeight="semibold" color="brand.navy">
          {session.user.name ?? session.user.email}
        </Text>
      </Text>
      <form action={logout}>
        <Button
          type="submit"
          {...buttonStyles}
          bg="white"
          color="brand.navy"
          borderWidth="1px"
          borderColor="brand.mist"
          _hover={{ bg: "brand.soft-white" }}
        >
          Sign out
        </Button>
      </form>
    </Flex>
  );
}
