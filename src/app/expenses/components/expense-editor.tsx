"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import type { ExpenseInput } from "@/app/expenses/expense-form/expense-schema";
import { COLORS } from "@/components/expense/colors";
import { ExpenseForm } from "@/components/expense/expense-form";
import {
  secondaryButtonStyles,
  surfaceStyles,
} from "@/components/expense/styles";

import { loadStoredExpenses, saveStoredExpenses } from "../storage";
import type { ExpenseRecord } from "../types";
import { createExpenseRecord, updateExpenseRecord } from "../utils";

interface ExpenseEditorProps {
  expenseId?: string;
}

function ExpenseEditorFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="main"
      minH="100dvh"
      display="grid"
      placeItems="center"
      bg={COLORS.page}
      color={COLORS.text}
      fontFamily="var(--font-geist-sans), Arial, Helvetica, sans-serif"
      p={6}
    >
      <Box {...surfaceStyles} w="full" maxW="27rem" p={{ base: 5, md: 6 }}>
        {children}
      </Box>
    </Box>
  );
}

function ExpenseEditorSkeleton() {
  return (
    <Stack role="status" aria-live="polite" gap="4">
      <Text srOnly>Loading expense…</Text>
      <Skeleton h="6" w="40" borderRadius="md" bg={COLORS.border} />
      <Skeleton h="10" w="full" borderRadius="lg" bg={COLORS.border} />
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
        <Skeleton h="10" borderRadius="lg" bg={COLORS.border} />
        <Skeleton h="10" borderRadius="lg" bg={COLORS.border} />
      </SimpleGrid>
      <Skeleton h="22" borderRadius="lg" bg={COLORS.border} />
      <Skeleton h="10" borderRadius="lg" bg={COLORS.border} />
    </Stack>
  );
}

export function ExpenseEditorLoading() {
  return (
    <ExpenseEditorFrame>
      <ExpenseEditorSkeleton />
    </ExpenseEditorFrame>
  );
}

function ExpenseNotFound() {
  return (
    <Stack gap="4" align="flex-start">
      <Box>
        <Heading
          as="h2"
          fontSize="lg"
          fontWeight="semibold"
          letterSpacing="tight"
          color={COLORS.text}
        >
          Expense not found
        </Heading>
        <Text mt="2" fontSize="sm" lineHeight="1.6" color={COLORS.muted}>
          This expense may have been deleted or was never saved in this browser.
        </Text>
      </Box>
      <Button asChild {...secondaryButtonStyles}>
        <Link href="/expenses">Back to expenses</Link>
      </Button>
    </Stack>
  );
}

export function ExpenseEditor({ expenseId }: ExpenseEditorProps) {
  const router = useRouter();
  const [expenses, setExpenses] = React.useState<ExpenseRecord[] | null>(null);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setExpenses(loadStoredExpenses());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [expenseId]);

  if (expenses === null) {
    return <ExpenseEditorLoading />;
  }

  const expense = expenseId
    ? (expenses.find((item) => item.id === expenseId) ?? null)
    : null;

  if (expenseId && !expense) {
    return (
      <ExpenseEditorFrame>
        <ExpenseNotFound />
      </ExpenseEditorFrame>
    );
  }

  const handleSubmit = (values: ExpenseInput) => {
    const storedExpenses = loadStoredExpenses();

    if (expenseId) {
      const currentExpense = storedExpenses.find(
        (item) => item.id === expenseId,
      );

      if (!currentExpense) {
        setExpenses(storedExpenses);
        return;
      }

      const updatedExpense = updateExpenseRecord(currentExpense, values);

      saveStoredExpenses(
        storedExpenses.map((item) =>
          item.id === updatedExpense.id ? updatedExpense : item,
        ),
      );
    } else {
      const createdExpense = createExpenseRecord(values);
      saveStoredExpenses([createdExpense, ...storedExpenses]);
    }

    router.push("/expenses");
  };

  return (
    <ExpenseEditorFrame>
      <ExpenseForm
        key={expense?.id ?? "new"}
        heading={expense ? "Edit expense" : "Add expense"}
        submitLabel={expense ? "Save changes" : "Save expense"}
        initialCategory={expense?.category}
        initialCurrency={expense?.currency ?? expenses[0]?.currency ?? "USD"}
        initialAmount={expense ? String(expense.amount) : undefined}
        initialDescription={expense?.description ?? undefined}
        initialExpenseDate={expense?.expenseDate}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/expenses")}
      />
    </ExpenseEditorFrame>
  );
}
