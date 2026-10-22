import { Box, Flex, Text } from "@chakra-ui/react";

import type { MonthlyPoint } from "@/lib/dashboard";

interface MonthlyTrendProps {
  points: MonthlyPoint[];
}

export function MonthlyTrendCard({ points }: MonthlyTrendProps) {
  const max = Math.max(
    ...points.flatMap((point) => [point.income, point.expenses]),
    1,
  );

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.mist"
      borderRadius="2xl"
      boxShadow="sm"
      p={{ base: 5, md: 6 }}
    >
      <Flex align="baseline" justify="space-between" gap={4} mb={5}>
        <Text fontSize="md" fontWeight="bold" color="brand.navy">
          Cash flow
        </Text>
        <Text fontSize="xs" color="brand.slate">
          Last {points.length} months
        </Text>
      </Flex>

      <Flex align="flex-end" gap={2} h="44" mb={3}>
        {points.map((point) => (
          <Flex
            key={point.key}
            direction="column"
            align="center"
            justify="flex-end"
            gap={2}
            flex="1"
            h="full"
          >
            <Flex align="flex-end" gap="4px" w="full" h="full">
              <Box
                flex="1"
                h={`${(point.income / max) * 100}%`}
                minH="4px"
                borderRadius="md"
                bg="brand.teal"
                title={`Income ${point.income}`}
              />
              <Box
                flex="1"
                h={`${(point.expenses / max) * 100}%`}
                minH="4px"
                borderRadius="md"
                bg="brand.gold"
                title={`Expenses ${point.expenses}`}
              />
            </Flex>
            <Text fontSize="xs" color="brand.slate">
              {point.label}
            </Text>
          </Flex>
        ))}
      </Flex>

      <Flex align="center" gap={4}>
        <Flex align="center" gap={2}>
          <Box boxSize="2.5" borderRadius="full" bg="brand.teal" />
          <Text fontSize="xs" color="brand.slate">
            Income
          </Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Box boxSize="2.5" borderRadius="full" bg="brand.gold" />
          <Text fontSize="xs" color="brand.slate">
            Expenses
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
