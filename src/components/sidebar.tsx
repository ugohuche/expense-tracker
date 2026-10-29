"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";

import { logout } from "@/lib/actions/auth";

type SidebarProps = {
  displayName: string;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Expenses",
    href: "/expenses",
  },
  {
    label: "Add expense",
    href: "/expenses/new",
  },
  {
    label: "Income",
    href: "/income",
  },
];

export default function Sidebar({ displayName }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Pick the most specific match so "/expenses/new" only highlights "Add expense".
  const activeHref = navigationItems
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  const closeSidebar = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        position="fixed"
        top="4"
        left="4"
        zIndex={1400}
        size="sm"
        borderRadius="lg"
        bg="brand.solid"
        color="brand.contrast"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        ☰
      </Button>

      <Drawer.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
        placement="start"
        size="xs"
      >
        <Drawer.Backdrop />

        <Drawer.Positioner>
          <Drawer.Content bg="bg.panel">
            <Drawer.Header borderBottomWidth="1px" borderColor="border">
              <Flex align="center" justify="space-between" width="full">
                <Flex align="center" gap={3}>
                  <Box
                    boxSize="3"
                    flexShrink={0}
                    borderRadius="full"
                    bg="brand.solid"
                  />

                  <Drawer.Title color="fg">Expense Tracker</Drawer.Title>
                </Flex>

                <Drawer.CloseTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Close navigation"
                  >
                    ✕
                  </Button>
                </Drawer.CloseTrigger>
              </Flex>
            </Drawer.Header>

            <Drawer.Body py={6}>
              <Flex
                as="nav"
                direction="column"
                gap={2}
                aria-label="Main navigation"
              >
                {navigationItems.map((item) => {
                  const isActive = item.href === activeHref;

                  return (
                    <Link
                      key={item.href}
                      asChild
                      onClick={closeSidebar}
                      px={4}
                      py={3}
                      borderRadius="lg"
                      fontSize="sm"
                      fontWeight="medium"
                      color={isActive ? "brand.fg" : "fg.muted"}
                      bg={isActive ? "bg.subtle" : "transparent"}
                      textDecoration="none"
                      _hover={{
                        bg: "bg.subtle",
                        color: "fg",
                        textDecoration: "none",
                      }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <NextLink href={item.href}>{item.label}</NextLink>
                    </Link>
                  );
                })}
              </Flex>
            </Drawer.Body>

            <Drawer.Footer
              display="block"
              borderTopWidth="1px"
              borderColor="border"
              p={4}
            >
              <Flex align="center" gap={3} mb={3}>
                <Avatar.Root size="sm" colorPalette="teal">
                  <Avatar.Fallback name={displayName} />
                </Avatar.Root>

                <Box minW={0}>
                  <Text fontSize="sm" color="fg" fontWeight="medium" truncate>
                    {displayName}
                  </Text>

                  <Text fontSize="xs" color="fg.muted">
                    Signed in
                  </Text>
                </Box>
              </Flex>

              <form action={logout}>
                <Button
                  type="submit"
                  width="full"
                  size="sm"
                  variant="outline"
                  borderColor="border"
                  color="fg"
                  _hover={{ bg: "bg.subtle" }}
                >
                  Sign out
                </Button>
              </form>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}
