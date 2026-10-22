import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";

import type { CategoryBreakdown, DashboardSummary } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/format";

interface SummaryCardsProps {
  summary: DashboardSummary;
  topCategory: CategoryBreakdown | null;
}

interface CardConfig {
  label: string;
  value: string;
  hint: string;
  accent: string;
}

export function SummaryCards({ summary, topCategory }: SummaryCardsProps) {
  const netAccent = summary.net >= 0 ? "brand.green" : "brand.red";

  const cards: CardConfig[] = [
    {
      label: "Income",
      value: formatCurrency(summary.income, summary.currency),
      hint: "Received this month",
      accent: "brand.teal",
    },
    {
      label: "Expenses",
      value: formatCurrency(summary.expenses, summary.currency),
      hint: `${summary.transactions} transaction${summary.transactions === 1 ? "" : "s"} logged`,
      accent: "brand.gold",
    },
    {
      label: "Net savings",
      value: formatCurrency(summary.net, summary.currency),
      hint:
        summary.net >= 0 ? "You are saving money" : "Spending exceeds income",
      accent: netAccent,
    },
    {
      label: "Top category",
      value: topCategory ? topCategory.label : "—",
      hint: topCategory
        ? `${formatCurrency(topCategory.total, summary.currency)} spent`
        : "No expenses this month",
      accent: "brand.navy",
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={4}>
      {cards.map((card) => (
        <Box
          key={card.label}
          bg="white"
          borderWidth="1px"
          borderColor="brand.mist"
          borderRadius="2xl"
          boxShadow="sm"
          p={5}
        >
          <Flex align="center" gap={3} mb={3}>
            <Flex
              align="center"
              justify="center"
              boxSize="9"
              borderRadius="xl"
              bg={`${card.accent}/12`}
            >
              <Box boxSize="2.5" borderRadius="full" bg={card.accent} />
            </Flex>
            <Text fontSize="sm" color="brand.slate" fontWeight="medium">
              {card.label}
            </Text>
          </Flex>

          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="brand.navy"
            letterSpacing="tight"
          >
            {card.value}
          </Text>
          <Text fontSize="xs" color="brand.slate" mt={1}>
            {card.hint}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
