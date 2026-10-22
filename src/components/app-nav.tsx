"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flex, Link as ChakraLink } from "@chakra-ui/react";

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

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expense-form", label: "Add expense" },
  { href: "/settings", label: "Settings" },
] as const;

export default function AppNav() {
  const pathname = usePathname();

  return (
    <Flex as="nav" align="center" gap={1} aria-label="Main">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <ChakraLink
            key={link.href}
            asChild
            {...navLinkStyles}
            bg={isActive ? "brand.soft-white" : "transparent"}
            color={isActive ? "brand.teal" : "brand.slate"}
            aria-current={isActive ? "page" : undefined}
          >
            <Link href={link.href}>{link.label}</Link>
          </ChakraLink>
        );
      })}
    </Flex>
  );
}
