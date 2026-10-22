"use client";

import * as React from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";

import { COLORS } from "../constants/colors";
import type { ExpenseRecord } from "../types";
import { formatCurrency, formatDate, getCategoryOption } from "../utils";
import { ExpenseDetailsDialog } from "./expense-details-dialog";

interface ExpensesTableProps {
  expenses: ExpenseRecord[];
  totalCount: number;
  page: number;
  pageCount: number;
  pageSize: number;
  hasFilters: boolean;
  hasAnyExpenses: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onEditExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (expense: ExpenseRecord) => void;
}

export function ExpensesTable({
  expenses,
  totalCount,
  page,
  pageCount,
  pageSize,
  hasFilters,
  hasAnyExpenses,
  onPageChange,
  onClearFilters,
  onEditExpense,
  onDeleteExpense,
}: ExpensesTableProps) {
  const [viewedExpense, setViewedExpense] =
    React.useState<ExpenseRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const pendingActionRef = React.useRef<(() => void) | null>(null);

  const openDetails = (expense: ExpenseRecord) => {
    pendingActionRef.current = null;
    setViewedExpense(expense);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const closeDetailsThen = (action: () => void) => {
    pendingActionRef.current = action;
    setIsDetailsOpen(false);
  };

  const handleDetailsExitComplete = () => {
    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    pendingAction?.();
  };

  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <Box
      bg={COLORS.card}
      borderWidth="1px"
      borderColor={COLORS.border}
      borderRadius="2xl"
      overflow="hidden"
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "flex-start", sm: "center" }}
        justify="space-between"
        gap={2}
        px={{ base: 4, md: 5 }}
        py={4}
      >
        <Box>
          <Text fontWeight="semibold" color={COLORS.text}>
            All expenses
          </Text>
          <Text fontSize="sm" color={COLORS.muted}>
            {hasAnyExpenses
              ? `${totalCount} ${totalCount === 1 ? "expense" : "expenses"}${
                  hasFilters
                    ? " matching your filters"
                    : " saved in this browser"
                }`
              : "No expenses recorded yet"}
          </Text>
          {totalCount > 0 ? (
            <Text mt={1} fontSize="xs" color={COLORS.muted}>
              Select a row to view its details and actions.
            </Text>
          ) : null}
        </Box>
        <Flex
          align="center"
          gap={1.5}
          bg="rgba(242, 169, 0, 0.12)"
          borderWidth="1px"
          borderColor="rgba(242, 169, 0, 0.32)"
          borderRadius="full"
          px={3}
          py={1}
        >
          <Box boxSize="1.5" borderRadius="full" bg={COLORS.gold} />
          <Text fontSize="xs" fontWeight="medium" color={COLORS.gold}>
            Saved in this browser
          </Text>
        </Flex>
      </Flex>

      <Text
        id="expense-table-instructions"
        position="absolute"
        w="1px"
        h="1px"
        p="0"
        m="-1px"
        overflow="hidden"
        whiteSpace="nowrap"
        borderWidth="0"
        clip="rect(0, 0, 0, 0)"
      >
        Select a row to view its details and actions. Press Enter or Space to
        open the details dialog.
      </Text>

      <Table.ScrollArea
        borderTopWidth="1px"
        borderColor={COLORS.border}
        maxH="34rem"
      >
        <Table.Root
          size="md"
          variant="line"
          stickyHeader
          bg="transparent"
          css={{
            "& th, & td": { borderColor: COLORS.border },
          }}
        >
          <Table.Header>
            <Table.Row bg={COLORS.page}>
              <Table.ColumnHeader color={COLORS.muted} fontSize="xs">
                Description
              </Table.ColumnHeader>
              <Table.ColumnHeader color={COLORS.muted} fontSize="xs">
                Category
              </Table.ColumnHeader>
              <Table.ColumnHeader color={COLORS.muted} fontSize="xs">
                Date
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color={COLORS.muted}
                fontSize="xs"
                textAlign="right"
              >
                Amount
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {expenses.length === 0 ? (
              <Table.Row bg={COLORS.card}>
                <Table.Cell colSpan={4} py={12} textAlign="center">
                  <Stack align="center" gap={3}>
                    <Flex
                      align="center"
                      justify="center"
                      boxSize="12"
                      borderRadius="full"
                      bg={COLORS.raised}
                      color={COLORS.muted}
                    >
                      <SearchIcon />
                    </Flex>
                    <Box>
                      <Text fontWeight="semibold" color={COLORS.text}>
                        {hasAnyExpenses
                          ? "No expenses match your filters"
                          : "No expenses yet"}
                      </Text>
                      <Text mt={1} fontSize="sm" color={COLORS.muted}>
                        {hasAnyExpenses
                          ? "Try a different search, category, or date range."
                          : "Use Add Expense to record your first expense. It will appear here immediately."}
                      </Text>
                    </Box>
                    {hasAnyExpenses && hasFilters ? (
                      <Button
                        size="sm"
                        variant="outline"
                        borderColor={COLORS.border}
                        color={COLORS.gold}
                        onClick={onClearFilters}
                      >
                        Clear filters
                      </Button>
                    ) : null}
                  </Stack>
                </Table.Cell>
              </Table.Row>
            ) : (
              expenses.map((expense) => {
                const category = getCategoryOption(expense.category);
                const isSelected =
                  isDetailsOpen && viewedExpense?.id === expense.id;

                return (
                  <Table.Row
                    key={expense.id}
                    bg={isSelected ? "rgba(242, 169, 0, 0.08)" : COLORS.card}
                    boxShadow={
                      isSelected ? "inset 3px 0 0 0 #F2A900" : undefined
                    }
                    data-selected={isSelected ? "true" : undefined}
                    _hover={{ bg: COLORS.raised }}
                    cursor="pointer"
                    tabIndex={0}
                    aria-describedby="expense-table-instructions"
                    aria-haspopup="dialog"
                    onClick={() => openDetails(expense)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDetails(expense);
                      }
                    }}
                    transition="background-color 0.15s ease"
                    _focusVisible={{
                      outline: "2px solid",
                      outlineColor: COLORS.gold,
                      outlineOffset: "-2px",
                    }}
                  >
                    <Table.Cell>
                      {expense.description ? (
                        <Text
                          display="block"
                          maxW={{ base: "13rem", md: "26rem" }}
                          truncate
                          color={COLORS.text}
                          title={expense.description}
                        >
                          {expense.description}
                        </Text>
                      ) : (
                        <Text as="span" color={COLORS.muted} fontStyle="italic">
                          No description
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex
                        display="inline-flex"
                        align="center"
                        gap={1.5}
                        bg={category.tint}
                        color="#1A202C"
                        borderRadius="full"
                        px={2.5}
                        py={1}
                        fontSize="xs"
                        fontWeight="medium"
                        whiteSpace="nowrap"
                      >
                        <span aria-hidden="true">{category.emoji}</span>
                        {category.label}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap" color={COLORS.muted}>
                      {formatDate(expense.expenseDate)}
                    </Table.Cell>
                    <Table.Cell
                      textAlign="right"
                      whiteSpace="nowrap"
                      fontWeight="semibold"
                      color={COLORS.text}
                      fontVariantNumeric="tabular-nums"
                    >
                      {formatCurrency(expense.amount, expense.currency)}
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {totalCount > 0 ? (
        <Flex
          direction={{ base: "column", sm: "row" }}
          align={{ base: "flex-start", sm: "center" }}
          justify="space-between"
          gap={3}
          borderTopWidth="1px"
          borderColor={COLORS.border}
          px={{ base: 4, md: 5 }}
          py={4}
        >
          <Text fontSize="sm" color={COLORS.muted}>
            Showing {start}–{end} of {totalCount}
          </Text>
          <HStack gap={1}>
            <Button
              size="sm"
              variant="ghost"
              color={COLORS.muted}
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
              _hover={{ bg: COLORS.raised, color: COLORS.text }}
            >
              <ChevronLeftIcon />
            </Button>
            {pages.map((pageNumber) => {
              const isActive = pageNumber === page;

              return (
                <Button
                  key={pageNumber}
                  size="sm"
                  variant="ghost"
                  minW="9"
                  px={0}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={isActive ? "page" : undefined}
                  bg={isActive ? "rgba(242, 169, 0, 0.14)" : undefined}
                  borderWidth={isActive ? "1px" : "0"}
                  borderColor="rgba(242, 169, 0, 0.35)"
                  color={isActive ? COLORS.gold : COLORS.muted}
                  fontWeight={isActive ? "semibold" : "normal"}
                  onClick={() => onPageChange(pageNumber)}
                  _hover={{ bg: COLORS.raised, color: COLORS.text }}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              size="sm"
              variant="ghost"
              color={COLORS.muted}
              disabled={page >= pageCount}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
              _hover={{ bg: COLORS.raised, color: COLORS.text }}
            >
              <ChevronRightIcon />
            </Button>
          </HStack>
        </Flex>
      ) : null}

      <ExpenseDetailsDialog
        open={isDetailsOpen}
        expense={viewedExpense}
        onClose={closeDetails}
        onEdit={(expense) => closeDetailsThen(() => onEditExpense(expense))}
        onDelete={(expense) => closeDetailsThen(() => onDeleteExpense(expense))}
        onExitComplete={handleDetailsExitComplete}
      />
    </Box>
  );
}

function SearchIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
