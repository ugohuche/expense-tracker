import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";

import AppNav from "@/components/app-nav";
import { logout } from "@/lib/actions/auth";

interface AppHeaderProps {
  displayName: string;
  avatarUrl?: string | null;
}

export default function AppHeader({ displayName, avatarUrl }: AppHeaderProps) {
  return (
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

          <AppNav />
        </Flex>

        <Flex align="center" gap={3}>
          <Flex align="center" gap={2} minW={0}>
            <Avatar.Root size="sm" colorPalette="teal">
              {avatarUrl ? (
                <Avatar.Image src={avatarUrl} alt={displayName} />
              ) : null}
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
  );
}
