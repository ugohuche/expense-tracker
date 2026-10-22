"use client";

import {
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";

import { COLORS } from "../constants/colors";
import type { ExpenseRecord } from "../types";
import { formatCurrency, formatDate, getCategoryOption } from "../utils";

interface ExpenseDetailsDialogProps {
  open: boolean;
  expense: ExpenseRecord | null;
  onClose: () => void;
  onEdit: (expense: ExpenseRecord) => void;
  onDelete: (expense: ExpenseRecord) => void;
  onExitComplete?: () => void;
}

export function ExpenseDetailsDialog({
  open,
  expense,
  onClose,
  onEdit,
  onDelete,
  onExitComplete,
}: ExpenseDetailsDialogProps) {
  const category = expense ? getCategoryOption(expense.category) : null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      onExitComplete={onExitComplete}
      size="sm"
      placement="center"
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop bg="rgba(3, 6, 12, 0.8)" backdropFilter="blur(6px)" />
      <Dialog.Positioner p={4}>
        <Dialog.Content
          bg={COLORS.card}
          borderWidth="1px"
          borderColor={COLORS.border}
          rounded="2xl"
          p={{ base: 5, md: 6 }}
          shadow="2xl"
        >
          <Flex align="flex-start" justify="space-between" gap={3}>
            <Box>
              <Dialog.Title
                fontSize="lg"
                fontWeight="semibold"
                letterSpacing="tight"
                color={COLORS.text}
              >
                Expense details
              </Dialog.Title>
              <Dialog.Description mt={1} fontSize="sm" color={COLORS.muted}>
                Review this expense, then edit or delete it.
              </Dialog.Description>
            </Box>
            <IconButton
              type="button"
              aria-label="Close expense details"
              title="Close"
              size="sm"
              variant="ghost"
              flexShrink={0}
              rounded="full"
              color={COLORS.muted}
              _hover={{ bg: COLORS.raised, color: COLORS.text }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: COLORS.gold,
                outlineOffset: "2px",
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Flex>

          {expense && category ? (
            <Box
              mt={5}
              borderWidth="1px"
              borderColor={COLORS.border}
              bg={COLORS.raised}
              rounded="xl"
              p={4}
            >
              <Text fontWeight="semibold" color={COLORS.text}>
                {expense.description?.trim() || "No description"}
              </Text>
              <Flex
                mt={2}
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                gap={2}
              >
                <HStack gap={2} fontSize="sm" color={COLORS.muted} wrap="wrap">
                  <Box as="span" whiteSpace="nowrap">
                    {category.emoji} {category.label}
                  </Box>
                  <Box as="span" aria-hidden="true">
                    ·
                  </Box>
                  <Box as="span" whiteSpace="nowrap">
                    {formatDate(expense.expenseDate)}
                  </Box>
                </HStack>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={COLORS.text}
                  fontVariantNumeric="tabular-nums"
                >
                  {formatCurrency(expense.amount, expense.currency)}
                </Text>
              </Flex>
            </Box>
          ) : null}

          <HStack mt={6} gap={3} align="stretch">
            <Button
              type="button"
              flex="1"
              h="11"
              bg={COLORS.gold}
              color="#11161F"
              fontSize="sm"
              fontWeight="semibold"
              disabled={!expense}
              _hover={{ bg: "#FFC21A" }}
              _active={{ bg: "#E09D00" }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: COLORS.gold,
                outlineOffset: "2px",
              }}
              onClick={() => {
                if (expense) {
                  onEdit(expense);
                }
              }}
            >
              <PencilIcon />
              <Text as="span" ml={2}>
                Edit
              </Text>
            </Button>
            <Button
              type="button"
              flex="1"
              h="11"
              variant="outline"
              bg="rgba(255, 122, 92, 0.08)"
              borderColor="rgba(255, 122, 92, 0.42)"
              color={COLORS.red}
              fontSize="sm"
              fontWeight="semibold"
              disabled={!expense}
              _hover={{ bg: "rgba(255, 122, 92, 0.16)" }}
              _active={{ bg: "rgba(255, 122, 92, 0.24)" }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: COLORS.gold,
                outlineOffset: "2px",
              }}
              onClick={() => {
                if (expense) {
                  onDelete(expense);
                }
              }}
            >
              <TrashIcon />
              <Text as="span" ml={2}>
                Delete
              </Text>
            </Button>
          </HStack>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function PencilIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}
