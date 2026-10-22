import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { formatDate } from "@/lib/format";

interface AccountSummaryProps {
  displayName: string;
  email: string;
  createdAt: Date;
  currency: string;
}

export function AccountSummary({
  displayName,
  email,
  createdAt,
  currency,
}: AccountSummaryProps) {
  const details = [
    { label: "Name", value: displayName },
    { label: "Email", value: email },
    { label: "Member since", value: formatDate(createdAt) },
    { label: "Currency", value: currency },
  ];

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.mist"
      borderRadius="2xl"
      boxShadow="sm"
      p={5}
    >
      <Heading as="h2" size="md" color="brand.navy">
        Account
      </Heading>
      <Text color="brand.slate" fontSize="sm" mt={1}>
        Read-only details about your account.
      </Text>

      <Flex direction="column" gap={4} mt={5}>
        {details.map((detail) => (
          <Flex key={detail.label} justify="space-between" gap={4}>
            <Text fontSize="sm" color="brand.slate">
              {detail.label}
            </Text>
            <Text
              fontSize="sm"
              color="brand.navy"
              fontWeight="medium"
              textAlign="right"
              truncate
            >
              {detail.value}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
