import Link from "next/link";
import { connection } from "next/server";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";

import { logout } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/session";

export const instant = false;

const navLinkStyles = {
  px: 3,
  py: 2,
  borderRadius: "full",
  fontSize: "sm",
  fontWeight: "medium",
  color: "brand.slate",
  _hover: {
    bg: "brand.soft-white",
    color: "brand.navy",
    textDecoration: "none",
  },
} as const;

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await connection();

  const user = await getCurrentUser();
  const displayName = user.name;

  return (
    <Flex direction="column" flex="1" bg="brand.soft-white">
      <Box
        as="header"
        bg="white"
        borderBottomWidth="1px"
        borderColor="brand.mist"
      >
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          wrap="wrap"
          maxW="7xl"
          mx="auto"
          px={{ base: 4, md: 8 }}
          py={3}
        >
          <Flex align="center" gap={{ base: 2, md: 6 }}>
            <Flex align="center" gap={2}>
              <Box boxSize="2.5" borderRadius="full" bg="brand.teal" />
              <Text
                fontWeight="bold"
                color="brand.navy"
                fontSize={{ base: "sm", md: "md" }}
                whiteSpace="nowrap"
              >
                Expense Tracker
              </Text>
            </Flex>

            <Flex as="nav" align="center" gap={1} aria-label="Main">
              <ChakraLink
                asChild
                {...navLinkStyles}
                bg="brand.soft-white"
                color="brand.teal"
                aria-current="page"
              >
                <Link href="/dashboard">Dashboard</Link>
              </ChakraLink>
              <ChakraLink asChild {...navLinkStyles}>
                <Link href="/expense-form">Add expense</Link>
              </ChakraLink>
            </Flex>
          </Flex>

          <Flex align="center" gap={3}>
            <Flex align="center" gap={2} minW={0}>
              <Avatar.Root size="sm" colorPalette="teal">
                <Avatar.Fallback name={displayName} />
              </Avatar.Root>
              <Text
                fontSize="sm"
                color="brand.navy"
                fontWeight="medium"
                maxW="12rem"
                truncate
                display={{ base: "none", md: "block" }}
              >
                {displayName}
              </Text>
            </Flex>

            <form action={logout}>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                borderRadius="full"
                borderColor="brand.mist"
                color="brand.navy"
                fontWeight="medium"
                _hover={{ bg: "brand.soft-white" }}
              >
                Sign out
              </Button>
            </form>
          </Flex>
        </Flex>
      </Box>

      <Box
        as="main"
        flex="1"
        w="full"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 10 }}
      >
        {children}
      </Box>
    </Flex>
  );
}
