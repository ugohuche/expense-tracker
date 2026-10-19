import { Suspense } from "react";
import { Box, Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import AuthStatus from "@/components/auth/auth-status";

const features = [
  {
    title: "Quick to log",
    description: "Add an expense in seconds and keep your record current.",
    accent: "brand.teal",
  },
  {
    title: "Clear overview",
    description: "See totals and categories at a glance, so nothing slips by.",
    accent: "brand.gold",
  },
  {
    title: "Better habits",
    description: "Understand where your money goes and plan with confidence.",
    accent: "brand.green",
  },
];

function StatusFallback() {
  return (
    <Flex gap={3} direction={{ base: "column", sm: "row" }}>
      <Box
        h={12}
        w={{ base: "full", sm: "40" }}
        borderRadius="full"
        bg="white"
        borderWidth="1px"
        borderColor="brand.mist"
      />
      <Box
        h={12}
        w={{ base: "full", sm: "32" }}
        borderRadius="full"
        bg="white"
        borderWidth="1px"
        borderColor="brand.mist"
      />
    </Flex>
  );
}

export default function Home() {
  return (
    <Flex
      as="main"
      position="relative"
      flex="1"
      minH="100dvh"
      overflow="hidden"
      bg="brand.soft-white"
    >
      <Box
        position="absolute"
        top="-140px"
        right="-100px"
        boxSize="360px"
        borderRadius="full"
        bg="brand.teal"
        opacity={0.12}
        filter="blur(90px)"
      />
      <Box
        position="absolute"
        bottom="-160px"
        left="-120px"
        boxSize="380px"
        borderRadius="full"
        bg="brand.gold"
        opacity={0.14}
        filter="blur(100px)"
      />

      <Flex
        position="relative"
        direction="column"
        align="center"
        justify="center"
        gap={{ base: 10, sm: 14 }}
        w="full"
        px={6}
        py={{ base: 12, sm: 20 }}
      >
        <Stack align="center" gap={6} textAlign="center" maxW="2xl">
          <Flex
            align="center"
            gap={2}
            bg="white"
            borderWidth="1px"
            borderColor="brand.mist"
            borderRadius="full"
            px={4}
            py={1.5}
            boxShadow="sm"
          >
            <Box boxSize="2" borderRadius="full" bg="brand.teal" />
            <Text fontSize="sm" fontWeight="medium" color="brand.navy">
              Expense Tracker
            </Text>
          </Flex>

          <Heading
            as="h1"
            color="brand.navy"
            fontSize={{ base: "4xl", sm: "5xl" }}
            fontWeight="bold"
            letterSpacing="tight"
            lineHeight="1.1"
          >
            Know where your money goes
          </Heading>

          <Text
            color="brand.slate"
            fontSize={{ base: "md", sm: "lg" }}
            lineHeight="1.7"
            maxW="xl"
          >
            Record your spending in seconds and see friendly, clear summaries —
            so you can plan with confidence.
          </Text>

          <Suspense fallback={<StatusFallback />}>
            <AuthStatus />
          </Suspense>
        </Stack>

        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={5} w="full" maxW="4xl">
          {features.map((feature) => (
            <Box
              key={feature.title}
              bg="white"
              borderWidth="1px"
              borderColor="brand.mist"
              borderRadius="2xl"
              boxShadow="sm"
              p={6}
            >
              <Flex
                align="center"
                justify="center"
                boxSize="11"
                mb={4}
                borderRadius="xl"
                bg={`${feature.accent}/12`}
              >
                <Box boxSize="2.5" borderRadius="full" bg={feature.accent} />
              </Flex>
              <Heading as="h2" size="md" mb={2} color="brand.navy">
                {feature.title}
              </Heading>
              <Text color="brand.slate" fontSize="sm" lineHeight="1.6">
                {feature.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
