import { Box, Flex, SimpleGrid, Skeleton, Stack } from "@chakra-ui/react";

import { COLORS } from "./constants/colors";

export default function Loading() {
  return (
    <Box
      as="main"
      minH="100dvh"
      bg={COLORS.page}
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 10 }}
    >
      <Stack maxW="7xl" mx="auto" gap={{ base: 5, md: 6 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "flex-start" }}
          gap={4}
        >
          <Stack gap={3}>
            <Skeleton h="4" w="36" bg={COLORS.raised} />
            <Skeleton h="10" w="72" bg={COLORS.raised} />
            <Skeleton h="4" w="96" maxW="full" bg={COLORS.raised} />
          </Stack>
          <Skeleton h="11" w="40" borderRadius="full" bg={COLORS.raised} />
        </Flex>

        <SimpleGrid
          columns={{ base: 1, sm: 2, xl: 4 }}
          gap={{ base: 3, md: 4 }}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} h="36" borderRadius="2xl" bg={COLORS.card} />
          ))}
        </SimpleGrid>

        <Skeleton h="20" borderRadius="2xl" bg={COLORS.card} />
        <Skeleton h="96" borderRadius="2xl" bg={COLORS.card} />
      </Stack>
    </Box>
  );
}
