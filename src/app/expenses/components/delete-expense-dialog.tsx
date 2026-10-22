"use client";

import { Box, Button, Dialog, Flex, HStack, Text } from "@chakra-ui/react";

import { COLORS } from "../constants/colors";
import type { ExpenseRecord } from "../types";
import { formatCurrency, formatDate, getCategoryOption } from "../utils";

interface DeleteExpenseDialogProps {
  open: boolean;
  expense: ExpenseRecord | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteExpenseDialog({
  open,
  expense,
  onClose,
  onConfirm,
}: DeleteExpenseDialogProps) {
  const category = expense ? getCategoryOption(expense.category) : null;
  const description = expense?.description?.trim() || "Untitled expense";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      size="sm"
      placement="center"
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop bg="rgba(3, 6, 12, 0.8)" backdropFilter="blur(6px)" />
      <Dialog.Positioner p={4}>
        <Dialog.Content
          role="alertdialog"
          bg={COLORS.card}
          borderWidth="1px"
          borderColor={COLORS.border}
          rounded="2xl"
          p={{ base: 5, md: 6 }}
          shadow="2xl"
        >
          <Dialog.Title
            fontSize="lg"
            fontWeight="semibold"
            letterSpacing="tight"
            color={COLORS.text}
          >
            Delete expense?
          </Dialog.Title>
          <Dialog.Description mt={2} fontSize="sm" color={COLORS.muted}>
            This will permanently remove the expense below from this browser.
            This action cannot be undone.
          </Dialog.Description>

          {expense ? (
            <Box
              mt={5}
              borderWidth="1px"
              borderColor={COLORS.border}
              bg={COLORS.raised}
              rounded="xl"
              p={4}
            >
              <Text fontWeight="semibold" color={COLORS.text}>
                {description}
              </Text>
              <Flex
                mt={2}
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                gap={2}
              >
                <HStack gap={2} fontSize="sm" color={COLORS.muted}>
                  {category ? (
                    <Box as="span" whiteSpace="nowrap">
                      {category.emoji} {category.label}
                    </Box>
                  ) : null}
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
              variant="outline"
              bg={COLORS.raised}
              borderColor={COLORS.border}
              color={COLORS.text}
              fontSize="sm"
              fontWeight="medium"
              autoFocus
              _hover={{ bg: "#1A2433", borderColor: "#2A3A52" }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: COLORS.gold,
                outlineOffset: "2px",
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              flex="1"
              h="11"
              bg={COLORS.red}
              color="#1A0F0C"
              fontSize="sm"
              fontWeight="semibold"
              _hover={{ bg: "#FF9B85" }}
              _active={{ bg: "#E8654C" }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: COLORS.gold,
                outlineOffset: "2px",
              }}
              onClick={onConfirm}
            >
              Delete expense
            </Button>
          </HStack>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
