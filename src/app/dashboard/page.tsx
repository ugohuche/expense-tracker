"use client";

import {
  Box,
  Flex,
  Grid,
  Heading,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";

const monthlySpending = [
  { month: "Jan", height: 24 },
  { month: "Feb", height: 40 },
  { month: "Mar", height: 28 },
  { month: "Apr", height: 52 },
  { month: "May", height: 44 },
  { month: "Jun", height: 64 },
];

const categories = [
  { name: "Food", value: 35, color: "#E4572E" },
  { name: "Transport", value: 20, color: "#0E8388" },
  { name: "Entertainment", value: 15, color: "#F2A900" },
];

const transactions = [
  {
    name: "Uber",
    category: "Transport",
    amount: "-R120",
    color: "#E4572E",
  },
  {
    name: "Checkers",
    category: "Groceries",
    amount: "-R450",
    color: "#E4572E",
  },
  {
    name: "Salary",
    category: "Income",
    amount: "+R5000",
    color: "#1B9E5A",
  },
];

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Box
      bg="white"
      p="6"
      borderRadius="xl"
      shadow="md"
      border="1px solid"
      borderColor="gray.100"
    >
      <Text fontSize="sm" color="gray.500">
        {label}
      </Text>

      <Text mt="2" fontSize="3xl" fontWeight="bold" color={color}>
        {value}
      </Text>
    </Box>
  );
}

export default function Dashboard() {
  return (
    <Box minH="100vh" bg="#F7F9FB" p={{ base: 4, md: 6 }}>
      {/* Header */}
      <Box
        mb="8"
        bg="#0B2545"
        color="white"
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        shadow="lg"
      >
        <Heading size="2xl">Expense Tracker Dashboard</Heading>

        <Text mt="2" color="gray.300">
          Track spending, monitor budgets, and manage your finances.
        </Text>
      </Box>

      {/* Summary Cards */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap="6"
      >
        <StatCard label="Total Expenses" value="R8,500" color="#E4572E" />

        <StatCard label="Monthly Budget" value="R10,000" color="#0E8388" />

        <StatCard label="Budget Left" value="R1,500" color="#1B9E5A" />

        <StatCard label="Savings" value="R3,200" color="#F2A900" />
      </Grid>

      {/* Monthly Spending */}
      <Box
        mt="8"
        bg="white"
        p="6"
        borderRadius="2xl"
        shadow="md"
        border="1px solid"
        borderColor="gray.100"
      >
        <Heading size="lg" color="#0B2545">
          Monthly Spending Trend
        </Heading>

        <Text mt="2" color="gray.500">
          Overview of expenses throughout the month
        </Text>

        <Box mt="6" h="320px" bg="#F8FAFC" p="6" borderRadius="xl">
          <Flex h="full" align="end" justify="space-between" gap="4">
            {monthlySpending.map((item) => (
              <Flex
                key={item.month}
                direction="column"
                align="center"
                justify="end"
                h="full"
                flex="1"
              >
                <Box
                  h={`${item.height * 4}px`}
                  maxH="260px"
                  w={{ base: "28px", md: "48px" }}
                  bg="#0E8388"
                  borderTopRadius="md"
                  transition="0.2s"
                  _hover={{
                    bg: "#08676B",
                    transform: "translateY(-4px)",
                  }}
                />

                <Text mt="2" fontSize="sm" color="gray.600">
                  {item.month}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Categories and Budget */}
      <Grid
        mt="8"
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
        }}
        gap="6"
      >
        {/* Spending Categories */}
        <Box
          bg="white"
          p="6"
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor="gray.100"
        >
          <Heading size="lg" color="#0B2545">
            Spending Categories
          </Heading>

          <Stack gap="5" mt="6">
            {categories.map((category) => (
              <Box key={category.name}>
                <Flex justify="space-between" mb="2">
                  <Text fontWeight="medium">{category.name}</Text>

                  <Text color="gray.500">{category.value}%</Text>
                </Flex>

                <Box h="3" bg="gray.200" borderRadius="full" overflow="hidden">
                  <Box
                    h="full"
                    width={`${category.value}%`}
                    bg={category.color}
                    borderRadius="full"
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Budget Progress */}
        <Box
          bg="white"
          p="6"
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor="gray.100"
        >
          <Link href="/expenses/new">Add expense</Link>
        </Button>
      </Flex>

          <Box mt="8">
            <Flex justify="space-between" mb="3">
              <Text color="gray.600">R8,500 of R10,000 used</Text>

              <Text fontWeight="bold" color="#1B9E5A">
                85%
              </Text>
            </Flex>

            <Progress.Root value={85} colorPalette="green" size="lg">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>

            <Text mt="4" fontSize="sm" color="gray.500">
              85% of monthly budget used
            </Text>
          </Box>
        </Box>
      </Grid>

      {/* Recent Transactions */}
      <Box
        mt="8"
        bg="white"
        p="6"
        borderRadius="2xl"
        shadow="md"
        border="1px solid"
        borderColor="gray.100"
      >
        <Flex justify="space-between" align="center" mb="6">
          <Heading size="lg" color="#0B2545">
            Recent Transactions
          </Heading>

          <Text fontSize="sm" color="#0E8388" fontWeight="semibold">
            Latest activity
          </Text>
        </Flex>

        <Stack gap="0">
          {transactions.map((transaction, index) => (
            <Flex
              key={transaction.name}
              align="center"
              justify="space-between"
              py="4"
              borderBottom={
                index !== transactions.length - 1 ? "1px solid" : "none"
              }
              borderColor="gray.100"
            >
              <Box>
                <Text fontWeight="semibold">{transaction.name}</Text>

                <Text fontSize="sm" color="gray.500">
                  {transaction.category}
                </Text>
              </Box>

              <Text fontWeight="bold" color={transaction.color}>
                {transaction.amount}
              </Text>
            </Flex>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
