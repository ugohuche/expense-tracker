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
import type { Category } from "../constants/categories";

export interface ExpenseFormProps {
  initialCategory?: Category;
  onCategoryChange?: (category: Category) => void;
}

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

      <VStack
        as="form"
        gap="6"
        align="stretch"
        onSubmit={(event) => event.preventDefault()}
      >
        <Field.Root gap="2">
          <Field.Label {...labelProps}>Amount</Field.Label>
          <Input
            type="number"
            min={0}
            placeholder="Please enter the amount"
            color="black"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
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
        </VStack>

        <Field.Root gap="2">
          <Field.Label {...labelProps}>Date</Field.Label>
          <Input ref={dateInputRef} type="date" color="black" />
        </Field.Root>

        <Field.Root gap="2">
          <Field.Label {...labelProps}>Notes</Field.Label>
          <Textarea
            minH="88px"
            color="black"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
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
