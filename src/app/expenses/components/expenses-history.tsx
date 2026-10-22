"use client";

import * as React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";

import type { ExpenseInput } from "@/app/expenses/expense-form/expense-schema";

import { DeleteExpenseDialog } from "./delete-expense-dialog";
import { ExpenseDetailsDialog } from "./expense-details-dialog";
import { ExpenseDialog } from "./expense-dialog";
import { ExpensesTable } from "./expenses-table";
import { ExpensesToolbar } from "./expenses-toolbar";
import { PlusIcon } from "./icons";
import { SummaryOverview } from "./summary-overview";
import { COLORS } from "../constants/colors";
import { focusRing, primaryButtonStyles } from "../constants/styles";
import { loadStoredExpenses, saveStoredExpenses } from "../storage";
import type { ExpenseFilters, ExpenseRecord } from "../types";
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

export function ExpensesHistory({ referenceDate }: ExpensesHistoryProps) {
  const [expenses, setExpenses] = React.useState<ExpenseRecord[]>([]);
  const [hasLoadedStoredExpenses, setHasLoadedStoredExpenses] =
    React.useState(false);
  const [filters, setFilters] = React.useState<ExpenseFilters>(DEFAULT_FILTERS);
  const [page, setPage] = React.useState(1);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [viewedExpense, setViewedExpense] =
    React.useState<ExpenseRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] =
    React.useState<ExpenseRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [deletingExpense, setDeletingExpense] =
    React.useState<ExpenseRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const pendingDetailsActionRef = React.useRef<(() => void) | null>(null);

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

  const openDetails = (expense: ExpenseRecord) => {
    pendingDetailsActionRef.current = null;
    setViewedExpense(expense);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const closeDetailsThen = (action: () => void) => {
    pendingDetailsActionRef.current = action;
    setIsDetailsOpen(false);
  };

  const handleDetailsExitComplete = () => {
    const pendingAction = pendingDetailsActionRef.current;
    pendingDetailsActionRef.current = null;
    pendingAction?.();
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
    setNotice("Expense saved in this browser.");
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
    setNotice("Expense updated in this browser.");
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
      minH="100dvh"
      bg={COLORS.page}
      color={COLORS.text}
      fontFamily="var(--font-geist-sans), Arial, Helvetica, sans-serif"
    >
      <Box
        maxW="6xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 8, md: 10 }}
      >
        <Stack gap={6}>
          <Flex
            as="header"
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "flex-start" }}
            justify="space-between"
            gap={4}
          >
            <Box>
              <Heading
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="semibold"
                letterSpacing="tight"
                color={COLORS.text}
              >
                Expenses
              </Heading>
              <Text mt={2} fontSize="sm" lineHeight="1.6" color={COLORS.muted}>
                Review and manage expenses saved in this browser.
              </Text>
            </Box>

            <Button
              type="button"
              flexShrink={0}
              onClick={() => setIsDialogOpen(true)}
              {...primaryButtonStyles}
            >
              <HStack gap={2}>
                <PlusIcon />
                <Text as="span">Add expense</Text>
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
              bg={COLORS.raised}
              borderWidth="1px"
              borderColor={COLORS.border}
              borderLeftWidth="3px"
              borderLeftColor={COLORS.gold}
              borderRadius="lg"
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
                _hover={{ bg: COLORS.goldSurface }}
                _focusVisible={focusRing}
                onClick={() => setNotice(null)}
              >
                Dismiss
              </Button>
            </Flex>
          ) : null}

          <Stack gap={4}>
            <SummaryOverview summary={summary} />

            <ExpensesToolbar
              filters={filters}
              hasFilters={hasFilters}
              onFilterChange={updateFilters}
              onClearFilters={clearFilters}
            />

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
              onViewExpense={openDetails}
              onAddExpense={() => setIsDialogOpen(true)}
            />
          </Stack>
        </Stack>
      </Box>

      <ExpenseDetailsDialog
        open={isDetailsOpen}
        expense={viewedExpense}
        onClose={closeDetails}
        onEdit={(expense) => closeDetailsThen(() => openEditDialog(expense))}
        onDelete={(expense) =>
          closeDetailsThen(() => openDeleteDialog(expense))
        }
        onExitComplete={handleDetailsExitComplete}
      />

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
