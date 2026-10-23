import { connection } from "next/server";
import { Box, Flex } from "@chakra-ui/react";

import AppHeader from "@/components/app-header";
import { getCurrentUser } from "@/lib/session";
import { getSettingsData } from "@/lib/settings";

export const instant = false;

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await connection();

  const user = await getCurrentUser();
  const data = await getSettingsData(user.id);

  return (
    <Flex direction="column" flex="1" bg="brand.soft-white">
      <AppHeader
        displayName={data?.name ?? user.name}
        avatarUrl={data?.profile.avatarUrl ?? null}
      />

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
