"use client";

import { Dialog } from "@chakra-ui/react";

import { ExpenseForm } from "@/app/expenses/expense-form/components/expense-form";
import type { Currency } from "@/app/expenses/expense-form/constants/currencies";
import type { ExpenseInput } from "@/app/expenses/expense-form/expense-schema";

import type { ExpenseRecord } from "../types";

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ExpenseInput) => void | Promise<void>;
  expense?: ExpenseRecord | null;
  defaultCurrency?: Currency;
}

export function ExpenseDialog({
  open,
  onClose,
  onSubmit,
  expense = null,
  defaultCurrency = "USD",
}: ExpenseDialogProps) {
  const isEditing = expense !== null;
  const title = isEditing ? "Edit Expense" : "Add New Expense";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      size="lg"
      placement="center"
      scrollBehavior="inside"
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop bg="rgba(3, 6, 12, 0.8)" backdropFilter="blur(6px)" />
      <Dialog.Positioner p={4}>
        <Dialog.Content
          bg="transparent"
          p={0}
          shadow="none"
          borderWidth="0"
          w="full"
          maxW="25rem"
          maxH="calc(100dvh - 2rem)"
          overflowY="auto"
        >
          <Dialog.Title
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
            {title}
          </Dialog.Title>
          <ExpenseForm
            key={expense?.id ?? "new"}
            heading={title}
            submitLabel={isEditing ? "Save Changes" : "Save Expense"}
            initialCategory={expense?.category}
            initialCurrency={expense?.currency ?? defaultCurrency}
            initialAmount={expense ? String(expense.amount) : undefined}
            initialDescription={expense?.description ?? undefined}
            initialExpenseDate={expense?.expenseDate}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
