import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";

import { getDashboardData } from "@/lib/dashboard";
import { formatMonth } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import { CategoryBreakdownCard } from "./components/category-breakdown";
import { MonthlyTrendCard } from "./components/monthly-trend";
import { RecentExpensesCard } from "./components/recent-expenses";
import { SummaryCards } from "./components/summary-cards";

export const metadata: Metadata = {
  title: "Dashboard · Expense Tracker",
};

export const instant = false;

export default async function DashboardPage() {
  await connection();

  const user = await getCurrentUser();
  const data = await getDashboardData(user.id);
  const currency = data.summary.currency;

  return (
    <Flex direction="column" gap={6}>
      <Flex
        align={{ base: "start", md: "center" }}
        justify="space-between"
        gap={4}
        wrap="wrap"
      >
        <Box>
          <Heading as="h1" size="lg" color="brand.navy">
            Dashboard
          </Heading>
          <Text color="brand.slate" fontSize="sm" mt={1}>
            Your money at a glance · {formatMonth(new Date())}
          </Text>
        </Box>

        <Button
          asChild
          bg="brand.teal"
          color="white"
          borderRadius="full"
          fontSize="sm"
          fontWeight="medium"
          _hover={{ bg: "brand.teal", opacity: 0.9 }}
        >
          <Link href="/expense-form">Add expense</Link>
        </Button>
      </Flex>

      <SummaryCards summary={data.summary} topCategory={data.topCategory} />

      <Grid
        templateColumns={{ base: "1fr", lg: "1.7fr 1fr" }}
        gap={6}
        alignItems="start"
      >
        <Flex direction="column" gap={6}>
          <CategoryBreakdownCard items={data.breakdown} currency={currency} />
          <RecentExpensesCard
            expenses={data.recentExpenses}
            currency={currency}
          />
        </Flex>

        <MonthlyTrendCard points={data.trend} />
      </Grid>
    </Flex>
  );
}
