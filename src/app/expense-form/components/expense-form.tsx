"use client";

import * as React from "react";
import {
  Box,
  Button,
  Field,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { CategoryPicker } from "./category-picker";
import { expenseSchema } from "../expense-schema";
import type { Category } from "../constants/categories";

export interface ExpenseFormProps {
  initialCategory?: Category;
  onCategoryChange?: (category: Category) => void;
}

type FormErrors = Partial<
  Record<"category" | "amount" | "description" | "expenseDate", string>
>;

function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const labelProps = {
  fontSize: "sm",
  fontWeight: "medium",
  color: "black",
} as const;

export function ExpenseForm({
  initialCategory,
  onCategoryChange,
}: ExpenseFormProps) {
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState<Category | null>(
    initialCategory ?? null,
  );
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isValid, setIsValid] = React.useState(false);
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (dateInputRef.current) {
      dateInputRef.current.value = today();
    }
  }, []);

  const handleCategoryChange = (value: Category) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsValid(false);

    const result = expenseSchema.safeParse({
      category: category ?? undefined,
      amount,
      description: notes,
      expenseDate: dateInputRef.current?.value ?? "",
    });

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (
          field === "category" ||
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
  };

  return (
    <Box
      position="relative"
      w="100%"
      maxW="2xl"
      bg="white"
      rounded="2xl"
      shadow="lg"
      p="6"
    >
      <IconButton
        aria-label="Close"
        type="button"
        position="absolute"
        top="3"
        right="3"
        size="sm"
        variant="ghost"
        color="gray.500"
        rounded="full"
      >
        <CloseIcon />
      </IconButton>

      <VStack as="form" gap="6" align="stretch" onSubmit={handleSubmit}>
        <Field.Root gap="2" invalid={Boolean(errors.amount)}>
          <Field.Label {...labelProps}>Amount</Field.Label>
          <Input
            type="number"
            min={0}
            placeholder="Please enter the amount"
            color="black"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          {errors.amount ? (
            <Field.ErrorText>{errors.amount}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <VStack gap="3" align="stretch">
          <Flex justify="space-between" align="center">
            <Text {...labelProps}>Category</Text>
            <Button type="button" size="sm" colorPalette="blue" rounded="md">
              Manage categories
            </Button>
          </Flex>
          <CategoryPicker
            value={category}
            onValueChange={handleCategoryChange}
          />
          {errors.category ? (
            <Text fontSize="sm" color="red.500">
              {errors.category}
            </Text>
          ) : null}
        </VStack>

        <Field.Root gap="2" invalid={Boolean(errors.expenseDate)}>
          <Field.Label {...labelProps}>Date</Field.Label>
          <Input ref={dateInputRef} type="date" color="black" />
          {errors.expenseDate ? (
            <Field.ErrorText>{errors.expenseDate}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <Field.Root gap="2" invalid={Boolean(errors.description)}>
          <Field.Label {...labelProps}>Notes</Field.Label>
          <Textarea
            minH="88px"
            color="black"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          {errors.description ? (
            <Field.ErrorText>{errors.description}</Field.ErrorText>
          ) : null}
        </Field.Root>

        <Button
          type="submit"
          variant="subtle"
          colorPalette="blue"
          size="lg"
          rounded="lg"
          mt="4"
        >
          ADD
        </Button>

        {isValid ? (
          <Text fontSize="sm" color="green.600" textAlign="center">
            Expense details are valid. Saving is not connected yet.
          </Text>
        ) : null}
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
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
