import { Flex, Text } from "@chakra-ui/react";

export function EmptyState({ message }: { message: string }) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap={2}
      py={10}
      px={6}
      textAlign="center"
      borderRadius="xl"
      bg="brand.soft-white"
    >
      <Text fontSize="sm" color="brand.slate">
        {message}
      </Text>
    </Flex>
  );
}
