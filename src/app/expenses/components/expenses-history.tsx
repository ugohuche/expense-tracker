"use client";

import * as React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";

import { CATEGORY_OPTIONS } from "@/app/expenses/expense-form/constants/categories";
import type { ExpenseInput } from "@/app/expenses/expense-form/expense-schema";

import { DeleteExpenseDialog } from "./delete-expense-dialog";
import { ExpenseDialog } from "./expense-dialog";
import { ExpensesTable } from "./expenses-table";
import { SummaryCards } from "./summary-cards";
import { COLORS } from "../constants/colors";
import { loadStoredExpenses, saveStoredExpenses } from "../storage";
import type {
  CategoryFilter,
  DateRangeFilter,
  ExpenseFilters,
  ExpenseRecord,
  SortOption,
} from "../types";
import {
  filterAndSortExpenses,
  parseDateKey,
  summarizeExpenses,
  toUtcDateKey,
} from "../utils";

const PAGE_SIZE = 8;

const DEFAULT_FILTERS: ExpenseFilters = {
  search: "",
  category: "all",
  dateRange: "all",
  sort: "date-desc",
};

interface ExpensesHistoryProps {
  /** YYYY-MM-DD reference date supplied by the server render. */
  referenceDate: string;
}

const selectStyles = {
  bg: COLORS.raised,
  borderColor: COLORS.border,
  color: COLORS.text,
  h: "10",
  rounded: "lg",
  fontSize: "sm",
  _hover: { borderColor: "#2A3A52" },
  _focusVisible: { borderColor: COLORS.gold, outlineColor: COLORS.gold },
  css: {
    "& option": {
      backgroundColor: COLORS.card,
      color: COLORS.text,
    },
  },
} as const;

export function ExpensesHistory({ referenceDate }: ExpensesHistoryProps) {
  const [expenses, setExpenses] = React.useState<ExpenseRecord[]>([]);
  const [hasLoadedStoredExpenses, setHasLoadedStoredExpenses] =
    React.useState(false);
  const [filters, setFilters] = React.useState<ExpenseFilters>(DEFAULT_FILTERS);
  const [page, setPage] = React.useState(1);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] =
    React.useState<ExpenseRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [deletingExpense, setDeletingExpense] =
    React.useState<ExpenseRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setExpenses(loadStoredExpenses());
      setHasLoadedStoredExpenses(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    if (!hasLoadedStoredExpenses) {
      return;
    }

    saveStoredExpenses(expenses);
  }, [expenses, hasLoadedStoredExpenses]);

  const reference = React.useMemo(
    () => parseDateKey(referenceDate),
    [referenceDate],
  );

  const summary = React.useMemo(
    () => summarizeExpenses(expenses, reference),
    [expenses, reference],
  );

  const filteredExpenses = React.useMemo(
    () => filterAndSortExpenses(expenses, filters, reference),
    [expenses, filters, reference],
  );

  const pageCount = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleExpenses = filteredExpenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasFilters =
    filters.search.trim() !== "" ||
    filters.category !== "all" ||
    filters.dateRange !== "all";

  const updateFilters = (patch: Partial<ExpenseFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleAddExpense = (values: ExpenseInput) => {
    const expense: ExpenseRecord = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      description: values.description,
      category: values.category,
      amount: Number(values.amount),
      currency: values.currency,
      expenseDate: toUtcDateKey(values.expenseDate),
    };

    setExpenses((current) => [expense, ...current]);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setIsDialogOpen(false);
    setNotice(
      "Expense saved in this browser only. It is not stored in a database.",
    );
  };

  const handleUpdateExpense = (values: ExpenseInput) => {
    if (!editingExpense) {
      return;
    }

    const updatedExpense: ExpenseRecord = {
      ...editingExpense,
      description: values.description,
      category: values.category,
      amount: Number(values.amount),
      currency: values.currency,
      expenseDate: toUtcDateKey(values.expenseDate),
    };

    setExpenses((current) =>
      current.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense,
      ),
    );
    setIsEditDialogOpen(false);
    setNotice(
      "Expense updated in this browser only. It is not stored in a database.",
    );
  };

  const handleDeleteExpense = () => {
    if (!deletingExpense) {
      return;
    }

    const description =
      deletingExpense.description?.trim() || "Untitled expense";

    setExpenses((current) =>
      current.filter((expense) => expense.id !== deletingExpense.id),
    );
    setIsDeleteDialogOpen(false);
    setNotice(`Deleted “${description}” from this browser.`);
  };

  const openEditDialog = (expense: ExpenseRecord) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (expense: ExpenseRecord) => {
    setDeletingExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Box
      as="main"
      position="relative"
      minH="100dvh"
      overflow="hidden"
      bg={COLORS.page}
      color={COLORS.text}
    >
      <Box
        position="absolute"
        top="-180px"
        right="-120px"
        boxSize="420px"
        borderRadius="full"
        bg="rgba(242, 169, 0, 0.09)"
        filter="blur(110px)"
        pointerEvents="none"
        aria-hidden="true"
      />
      <Box
        position="absolute"
        bottom="-200px"
        left="-140px"
        boxSize="440px"
        borderRadius="full"
        bg="rgba(14, 131, 136, 0.12)"
        filter="blur(120px)"
        pointerEvents="none"
        aria-hidden="true"
      />

      <Box
        position="relative"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={{ base: 8, md: 10 }}
      >
        <Stack gap={{ base: 5, md: 6 }}>
          <Flex
            as="header"
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
            justify="space-between"
            gap={4}
          >
            <Stack gap={1.5}>
              <HStack gap={2}>
                <Box boxSize="2" borderRadius="full" bg={COLORS.gold} />
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  color={COLORS.gold}
                >
                  Expense Tracker
                </Text>
              </HStack>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="semibold"
                letterSpacing="tight"
                color={COLORS.text}
              >
                Expenses History
              </Heading>
              <Text
                maxW="2xl"
                fontSize="sm"
                lineHeight="1.7"
                color={COLORS.muted}
              >
                Review, search, and filter your spending. Expenses are saved in
                this browser only and are not sent to a database.
              </Text>
            </Stack>

            <Button
              type="button"
              flexShrink={0}
              h="11"
              px={5}
              borderRadius="full"
              bg={COLORS.gold}
              color="#11161F"
              fontWeight="semibold"
              _hover={{ bg: "#FFC21A" }}
              _active={{ bg: "#E09D00" }}
              onClick={() => setIsDialogOpen(true)}
            >
              <HStack gap={2}>
                <PlusIcon />
                <Text as="span">Add Expense</Text>
              </HStack>
            </Button>
          </Flex>

          {notice ? (
            <Flex
              role="status"
              aria-live="polite"
              align={{ base: "flex-start", sm: "center" }}
              justify="space-between"
              direction={{ base: "column", sm: "row" }}
              gap={2}
              bg="rgba(242, 169, 0, 0.1)"
              borderWidth="1px"
              borderColor="rgba(242, 169, 0, 0.32)"
              borderRadius="xl"
              px={4}
              py={3}
            >
              <Text fontSize="sm" color={COLORS.text}>
                {notice}
              </Text>
              <Button
                size="xs"
                variant="ghost"
                color={COLORS.gold}
                _hover={{ bg: "rgba(242, 169, 0, 0.14)" }}
                onClick={() => setNotice(null)}
              >
                Dismiss
              </Button>
            </Flex>
          ) : null}

          <SummaryCards summary={summary} />

          <Box
            bg={COLORS.card}
            borderWidth="1px"
            borderColor={COLORS.border}
            borderRadius="2xl"
            p={{ base: 3, md: 4 }}
          >
            <Flex
              direction={{ base: "column", lg: "row" }}
              align={{ lg: "center" }}
              gap={3}
            >
              <Box
                position="relative"
                flex="1"
                minW={{ base: "full", lg: "260px" }}
              >
                <Box
                  position="absolute"
                  top="50%"
                  left="3"
                  zIndex="1"
                  transform="translateY(-50%)"
                  color={COLORS.muted}
                  pointerEvents="none"
                  aria-hidden="true"
                >
                  <SearchIcon />
                </Box>
                <Input
                  ps="10"
                  h="10"
                  placeholder="Search descriptions…"
                  aria-label="Search expenses by description"
                  bg={COLORS.raised}
                  borderColor={COLORS.border}
                  color={COLORS.text}
                  fontSize="sm"
                  rounded="lg"
                  focusRingColor={COLORS.gold}
                  _placeholder={{ color: "#64748B" }}
                  _hover={{ borderColor: "#2A3A52" }}
                  value={filters.search}
                  onChange={(event) =>
                    updateFilters({ search: event.target.value })
                  }
                />
              </Box>

              <NativeSelect.Root
                size="sm"
                w={{ base: "full", lg: "180px" }}
                flexShrink={0}
              >
                <NativeSelect.Field
                  aria-label="Filter by category"
                  value={filters.category}
                  onChange={(event) =>
                    updateFilters({
                      category: event.target.value as CategoryFilter,
                    })
                  }
                  {...selectStyles}
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator color={COLORS.muted} />
              </NativeSelect.Root>

              <NativeSelect.Root
                size="sm"
                w={{ base: "full", lg: "165px" }}
                flexShrink={0}
              >
                <NativeSelect.Field
                  aria-label="Filter by date range"
                  value={filters.dateRange}
                  onChange={(event) =>
                    updateFilters({
                      dateRange: event.target.value as DateRangeFilter,
                    })
                  }
                  {...selectStyles}
                >
                  <option value="all">All time</option>
                  <option value="this-month">This month</option>
                  <option value="last-month">Last month</option>
                  <option value="this-year">This year</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator color={COLORS.muted} />
              </NativeSelect.Root>

              <NativeSelect.Root
                size="sm"
                w={{ base: "full", lg: "175px" }}
                flexShrink={0}
              >
                <NativeSelect.Field
                  aria-label="Sort expenses"
                  value={filters.sort}
                  onChange={(event) =>
                    updateFilters({
                      sort: event.target.value as SortOption,
                    })
                  }
                  {...selectStyles}
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="amount-desc">Highest amount</option>
                  <option value="amount-asc">Lowest amount</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator color={COLORS.muted} />
              </NativeSelect.Root>

              {hasFilters ? (
                <Button
                  size="sm"
                  variant="ghost"
                  flexShrink={0}
                  color={COLORS.gold}
                  _hover={{ bg: "rgba(242, 169, 0, 0.12)" }}
                  onClick={clearFilters}
                >
                  Reset
                </Button>
              ) : null}
            </Flex>
          </Box>

          <ExpensesTable
            expenses={visibleExpenses}
            totalCount={filteredExpenses.length}
            page={currentPage}
            pageCount={pageCount}
            pageSize={PAGE_SIZE}
            hasFilters={hasFilters}
            hasAnyExpenses={expenses.length > 0}
            onPageChange={setPage}
            onClearFilters={clearFilters}
            onEditExpense={openEditDialog}
            onDeleteExpense={openDeleteDialog}
          />
        </Stack>
      </Box>

      <ExpenseDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddExpense}
        defaultCurrency={expenses[0]?.currency ?? "USD"}
      />

      <ExpenseDialog
        open={isEditDialogOpen}
        expense={editingExpense}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateExpense}
        defaultCurrency={expenses[0]?.currency ?? "USD"}
      />

      <DeleteExpenseDialog
        open={isDeleteDialogOpen}
        expense={deletingExpense}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteExpense}
      />
    </Box>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}
