"use client";

import * as React from "react";
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { CATEGORY_OPTIONS, type Category } from "../constants/categories";
import { CURRENCY_OPTIONS, type Currency } from "../constants/currencies";
import { expenseSchema, type ExpenseInput } from "../expense-schema";
import { COLORS } from "../../constants/colors";
import { formatDate } from "../../utils";

export interface ExpenseFormProps {
  initialCategory?: Category;
  initialCurrency?: Currency;
  initialAmount?: string;
  initialDescription?: string;
  initialExpenseDate?: string;
  heading?: string;
  submitLabel?: string;
  onCategoryChange?: (category: Category) => void;
  onSubmit?: (values: ExpenseInput) => void | Promise<void>;
  onCancel?: () => void;
}

type FormErrors = Partial<
  Record<
    "category" | "currency" | "amount" | "description" | "expenseDate",
    string
  >
>;

const labelProps = {
  fontSize: "sm",
  fontWeight: "medium",
  color: COLORS.text,
} as const;

const fieldProps = {
  bg: COLORS.raised,
  borderColor: COLORS.border,
  color: COLORS.text,
  rounded: "lg",
  fontSize: "sm",
  _placeholder: { color: "#64748B" },
  _hover: { borderColor: "#2A3A52" },
  _focusVisible: {
    borderColor: COLORS.gold,
    outlineColor: COLORS.gold,
  },
} as const;

const selectOptionsStyles = {
  "& option": {
    backgroundColor: COLORS.card,
    color: COLORS.text,
  },
} as const;

function RequiredMark() {
  return (
    <Text as="span" ml="1" color={COLORS.red}>
      *
    </Text>
  );
}

export function ExpenseForm({
  initialCategory,
  initialCurrency,
  initialAmount,
  initialDescription,
  initialExpenseDate,
  heading = "Add New Expense",
  submitLabel = "Save Expense",
  onCategoryChange,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [amount, setAmount] = React.useState(initialAmount ?? "");
  const [currency, setCurrency] = React.useState<Currency>(
    initialCurrency ?? "USD",
  );
  const [category, setCategory] = React.useState<Category | null>(
    initialCategory ?? null,
  );
  const [description, setDescription] = React.useState(
    initialDescription ?? "",
  );
  const [expenseDate, setExpenseDate] = React.useState(
    initialExpenseDate ?? "",
  );
  const [isDateFocused, setIsDateFocused] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isValid, setIsValid] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const submitGuard = React.useRef(false);

  const handleCategoryChange = (value: Category) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (submitGuard.current) {
      return;
    }

    setIsValid(false);
    setSubmitError(null);

    const result = expenseSchema.safeParse({
      category: category ?? undefined,
      currency,
      amount,
      description,
      expenseDate,
    });

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (
          field === "category" ||
          field === "currency" ||
          field === "amount" ||
          field === "description" ||
          field === "expenseDate"
        ) {
          nextErrors[field] ??= issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsValid(true);

    if (!onSubmit) {
      return;
    }

    setIsSubmitting(true);
    submitGuard.current = true;
    try {
      await onSubmit(result.data);
    } catch {
      setSubmitError(
        "We couldn't save this expense. Please check your details and try again.",
      );
    } finally {
      submitGuard.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      w="full"
      maxW="25rem"
      mx="auto"
      bg={COLORS.card}
      borderWidth="1px"
      borderColor={COLORS.border}
      rounded="2xl"
      p={{ base: 5, md: 6 }}
      shadow="2xl"
    >
      <Flex align="center" justify="space-between" gap="3" mb="5">
        <Heading
          as="h2"
          fontSize="lg"
          fontWeight="semibold"
          letterSpacing="tight"
          color={COLORS.text}
        >
          {heading}
        </Heading>
        {onCancel ? (
          <IconButton
            type="button"
            aria-label="Close"
            size="sm"
            variant="ghost"
            flexShrink={0}
            rounded="full"
            color={COLORS.muted}
            _hover={{ bg: COLORS.raised, color: COLORS.text }}
            onClick={onCancel}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </Flex>

      <VStack as="form" gap="4" align="stretch" onSubmit={handleSubmit}>
        <Field.Root gap="2" invalid={Boolean(errors.amount)}>
          <Field.Label {...labelProps}>
            Amount
            <RequiredMark />
          </Field.Label>
          <Flex
            align="center"
            bg={COLORS.raised}
            borderWidth="1px"
            borderColor={COLORS.border}
            rounded="lg"
            h="11"
            _hover={{ borderColor: "#2A3A52" }}
            css={{
              "&:focus-within": {
                borderColor: COLORS.gold,
                boxShadow: "0 0 0 1px rgba(242, 169, 0, 0.45)",
              },
            }}
          >
            <Input
              type="number"
              step="any"
              inputMode="decimal"
              borderWidth="0"
              bg="transparent"
              color={COLORS.text}
              h="full"
              px="3"
              fontSize="sm"
              placeholder="0.00"
              aria-label="Amount"
              aria-required="true"
              _placeholder={{ color: "#64748B" }}
              _focusVisible={{ outline: "none", boxShadow: "none" }}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <Box
              h="6"
              borderLeftWidth="1px"
              borderColor={COLORS.border}
              flexShrink={0}
            />
            <NativeSelect.Root
              size="sm"
              variant="plain"
              w="20"
              h="full"
              flexShrink={0}
            >
              <NativeSelect.Field
                aria-label="Currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value as Currency)
                }
                h="full"
                borderWidth="0"
                bg="transparent"
                color={COLORS.text}
                fontSize="sm"
                fontWeight="medium"
                ps="3"
                pe="7"
                cursor="pointer"
                _focusVisible={{ outline: "none", boxShadow: "none" }}
                css={selectOptionsStyles}
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator color={COLORS.muted} right="2" />
            </NativeSelect.Root>
          </Flex>
          {errors.amount || errors.currency ? (
            <Field.ErrorText color={COLORS.red} fontSize="xs">
              {errors.amount ?? errors.currency}
            </Field.ErrorText>
          ) : null}
        </Field.Root>

        <Field.Root gap="2" invalid={Boolean(errors.expenseDate)}>
          <Field.Label {...labelProps}>
            Date
            <RequiredMark />
          </Field.Label>
          <Box position="relative" w="full">
            <Input
              {...fieldProps}
              type="date"
              w="full"
              h="11"
              aria-label="Date"
              aria-required="true"
              value={expenseDate}
              onChange={(event) => setExpenseDate(event.target.value)}
              onFocus={() => setIsDateFocused(true)}
              onBlur={() => setIsDateFocused(false)}
              color={isDateFocused ? COLORS.text : "transparent"}
              css={{
                colorScheme: "dark",
                "&::-webkit-calendar-picker-indicator": {
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                },
              }}
            />
            {!isDateFocused ? (
              <Text
                position="absolute"
                left="3"
                top="50%"
                transform="translateY(-50%)"
                fontSize="sm"
                color={expenseDate ? COLORS.text : "#64748B"}
                pointerEvents="none"
              >
                {expenseDate ? formatDate(expenseDate) : "Select date"}
              </Text>
            ) : null}
            <Box
              position="absolute"
              right="3"
              top="50%"
              transform="translateY(-50%)"
              color={COLORS.muted}
              pointerEvents="none"
              aria-hidden="true"
            >
              <CalendarIcon />
            </Box>
          </Box>
          {errors.expenseDate ? (
            <Field.ErrorText color={COLORS.red} fontSize="xs">
              {errors.expenseDate}
            </Field.ErrorText>
          ) : null}
        </Field.Root>

        <Field.Root gap="2" invalid={Boolean(errors.category)}>
          <Field.Label {...labelProps}>
            Category
            <RequiredMark />
          </Field.Label>
          <NativeSelect.Root size="md" w="full" variant="plain">
            <NativeSelect.Field
              aria-label="Category"
              aria-required="true"
              value={category ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                if (value) {
                  handleCategoryChange(value as Category);
                }
              }}
              h="11"
              bg={COLORS.raised}
              borderWidth="1px"
              borderColor={COLORS.border}
              rounded="lg"
              color={category ? COLORS.text : "#64748B"}
              fontSize="sm"
              px="3"
              pe="9"
              cursor="pointer"
              _hover={{ borderColor: "#2A3A52" }}
              _focusVisible={{
                borderColor: COLORS.gold,
                outlineColor: COLORS.gold,
              }}
              css={selectOptionsStyles}
            >
              <option value="" disabled>
                Select category
              </option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator color={COLORS.muted} />
          </NativeSelect.Root>
          {errors.category ? (
            <Field.ErrorText color={COLORS.red} fontSize="xs">
              {errors.category}
            </Field.ErrorText>
          ) : null}
        </Field.Root>

        <Field.Root gap="2" invalid={Boolean(errors.description)}>
          <Field.Label {...labelProps}>Description</Field.Label>
          <Textarea
            {...fieldProps}
            minH="22"
            p="3"
            aria-label="Description"
            placeholder="Enter description..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description ? (
            <Field.ErrorText color={COLORS.red} fontSize="xs">
              {errors.description}
            </Field.ErrorText>
          ) : null}
        </Field.Root>

        {submitError ? (
          <Text role="alert" fontSize="sm" color={COLORS.red}>
            {submitError}
          </Text>
        ) : null}

        {isValid && !onSubmit ? (
          <Text fontSize="sm" color={COLORS.green}>
            Expense details are valid. Saving is not connected yet.
          </Text>
        ) : null}

        <HStack gap="3" mt="1" align="stretch">
          {onCancel ? (
            <Button
              type="button"
              flex="0 0 34%"
              h="11"
              variant="outline"
              bg={COLORS.raised}
              borderColor={COLORS.border}
              color={COLORS.text}
              fontSize="sm"
              fontWeight="medium"
              _hover={{ bg: "#1A2433", borderColor: "#2A3A52" }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: COLORS.gold,
                outlineOffset: "2px",
              }}
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            flex="1"
            h="11"
            bg={COLORS.gold}
            color="#11161F"
            fontSize="sm"
            fontWeight="semibold"
            _hover={{ bg: "#FFC21A" }}
            _active={{ bg: "#E09D00" }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: COLORS.gold,
              outlineOffset: "2px",
            }}
            loading={isSubmitting}
            loadingText="Saving…"
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        </HStack>
      </VStack>
    </Box>
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

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
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
