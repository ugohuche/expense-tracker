import type { ReactNode } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";

import { COLORS } from "../constants/colors";
import type { CurrencyTotal, ExpenseSummary } from "../types";
import {
  formatCurrency,
  formatPercentChange,
  getCategoryOption,
} from "../utils";

interface SummaryCardsProps {
  summary: ExpenseSummary;
}

interface SummaryCard {
  label: string;
  value: string;
  caption: string;
  accent: string;
  valueColor?: string;
  icon: ReactNode;
}

function formatTotals(totals: CurrencyTotal[]): string {
  return totals
    .map((entry) => formatCurrency(entry.total, entry.currency))
    .join(" · ");
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const primaryMonth = summary.monthTotals[0];
  const primaryYear = summary.yearTotals[0];
  const comparisonCurrency =
    primaryMonth?.currency ?? summary.lastMonthTotals[0]?.currency;
  const currentComparisonTotal = comparisonCurrency
    ? (summary.monthTotals.find(
        (entry) => entry.currency === comparisonCurrency,
      )?.total ?? 0)
    : 0;
  const previousComparisonTotal = comparisonCurrency
    ? (summary.lastMonthTotals.find(
        (entry) => entry.currency === comparisonCurrency,
      )?.total ?? 0)
    : 0;
  const change =
    comparisonCurrency && previousComparisonTotal > 0
      ? ((currentComparisonTotal - previousComparisonTotal) /
          previousComparisonTotal) *
        100
      : null;
  const monthOthers = summary.monthTotals.slice(1);
  const yearOthers = summary.yearTotals.slice(1);
  const topCategoryOption = summary.topCategory
    ? getCategoryOption(summary.topCategory.category)
    : null;
  const comparisonHasOthers =
    summary.monthTotals.length > 1 || summary.lastMonthTotals.length > 1;

  const monthCaption = `${summary.monthCount} expense${
    summary.monthCount === 1 ? "" : "s"
  } so far${monthOthers.length > 0 ? ` · also ${formatTotals(monthOthers)}` : ""}`;
  const yearCaption = `${summary.yearCount} expense${
    summary.yearCount === 1 ? "" : "s"
  } this year${yearOthers.length > 0 ? ` · also ${formatTotals(yearOthers)}` : ""}`;
  const comparisonCaption = comparisonCurrency
    ? previousComparisonTotal > 0
      ? `${comparisonCurrency} · vs. ${formatCurrency(
          previousComparisonTotal,
          comparisonCurrency,
        )} last month${comparisonHasOthers ? " · other currencies excluded" : ""}`
      : `No ${comparisonCurrency} spending last month to compare.`
    : "No spending recorded yet.";
  const topCategoryCaption = summary.topCategory
    ? `${formatCurrency(
        summary.topCategory.total,
        summary.topCategory.currency,
      )} across ${summary.topCategory.count} expense${
        summary.topCategory.count === 1 ? "" : "s"
      }${monthOthers.length > 0 ? " · other currencies excluded" : ""}`
    : "No spending this month.";

  const cards: SummaryCard[] = [
    {
      label: "This Month",
      value: formatCurrency(
        primaryMonth?.total ?? 0,
        primaryMonth?.currency ?? "USD",
      ),
      caption: monthCaption,
      accent: COLORS.green,
      icon: <WalletIcon />,
    },
    {
      label: "Top Category",
      value: topCategoryOption?.label ?? "—",
      caption: topCategoryCaption,
      accent: COLORS.gold,
      icon: topCategoryOption ? (
        <Text fontSize="lg" lineHeight="1">
          {topCategoryOption.emoji}
        </Text>
      ) : (
        <TagIcon />
      ),
    },
    {
      label: "Month vs Last Month",
      value: change === null ? "—" : formatPercentChange(change),
      caption: comparisonCaption,
      accent: COLORS.blue,
      valueColor:
        change === null
          ? undefined
          : change > 0
            ? COLORS.red
            : change < 0
              ? COLORS.green
              : undefined,
      icon: <TrendIcon />,
    },
    {
      label: "Year to Date",
      value: formatCurrency(
        primaryYear?.total ?? 0,
        primaryYear?.currency ?? "USD",
      ),
      caption: yearCaption,
      accent: COLORS.purple,
      icon: <CalendarIcon />,
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={{ base: 3, md: 4 }}>
      {cards.map((card) => (
        <Box
          key={card.label}
          bg={COLORS.card}
          borderWidth="1px"
          borderColor={COLORS.border}
          borderRadius="2xl"
          p={{ base: 4, md: 5 }}
        >
          <Flex justify="space-between" align="flex-start" gap={3}>
            <Box minW={0}>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={COLORS.muted}
              >
                {card.label}
              </Text>
              <Text
                mt={2}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="semibold"
                letterSpacing="tight"
                color={card.valueColor ?? COLORS.text}
              >
                {card.value}
              </Text>
            </Box>
            <Flex
              align="center"
              justify="center"
              boxSize="10"
              flexShrink={0}
              borderRadius="xl"
              bg={`${card.accent}1A`}
              color={card.accent}
            >
              {card.icon}
            </Flex>
          </Flex>
          <Text
            mt={3}
            minH="2.5rem"
            fontSize="xs"
            lineHeight="1.5"
            color={COLORS.muted}
          >
            {card.caption}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}

function WalletIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a3 3 0 0 1 3 3v1" />
      <path d="M3 7.5V17a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-2.5" />
      <path d="M21 9H16a3 3 0 0 0 0 6h5V9Z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 16.5 8.5 11l3.5 3.5L21 5.5" />
      <path d="M15.5 5.5H21v5.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 9.5h17" />
    </svg>
  );
}
