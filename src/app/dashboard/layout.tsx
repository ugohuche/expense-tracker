import { connection } from "next/server";
import { Box, Flex } from "@chakra-ui/react";

import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/session";

export const instant = false;

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await connection();

  const user = await getCurrentUser();

  return (
    <Flex direction="column" flex="1" bg="bg.subtle">
      <Sidebar displayName={user.name} />

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
