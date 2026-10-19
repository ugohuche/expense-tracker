"use client";

import { useState } from "react";
import { Box, chakra, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { CATEGORY_OPTIONS, type Category } from "../constants/categories";

const TileButton = chakra("button");

export interface CategoryPickerProps {
  value: Category | null;
  onValueChange: (category: Category) => void;
}

export function CategoryPicker({ value, onValueChange }: CategoryPickerProps) {
  const [query, setQuery] = useState("");
  const options = CATEGORY_OPTIONS.filter((option) =>
    option.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <VStack align="stretch" gap="3">
      <Box position="relative">
        <Box
          position="absolute"
          top="50%"
          left="3"
          transform="translateY(-50%)"
          color="gray.500"
          pointerEvents="none"
          aria-hidden="true"
        >
          <SearchIcon />
        </Box>
        <Input
          ps="10"
          placeholder="Quick Search"
          aria-label="Search categories"
          color="black"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Box>

      {options.length > 0 ? (
        <HStack gap="3" pb="2" overflowX="auto" aria-label="Categories">
          {options.map((option) => (
            <CategoryTile
              key={option.name}
              option={option}
              selected={option.name === value}
              onSelect={() => onValueChange(option.name)}
            />
          ))}
        </HStack>
      ) : (
        <Text fontSize="sm" color="black">
          No categories found
        </Text>
      )}
    </VStack>
  );
}

interface CategoryTileProps {
  option: (typeof CATEGORY_OPTIONS)[number];
  selected: boolean;
  onSelect: () => void;
}

function CategoryTile({ option, selected, onSelect }: CategoryTileProps) {
  return (
    <TileButton
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="2"
      flexShrink={0}
      minW="24"
      px="3"
      py="3"
      bg="white"
      borderWidth={selected ? "2px" : "1px"}
      borderColor={selected ? "gray.800" : "gray.200"}
      rounded="xl"
      shadow="sm"
      cursor="pointer"
      _hover={{ borderColor: selected ? "gray.800" : "gray.400" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "blue.500",
        outlineOffset: "2px",
      }}
    >
      <Box
        boxSize="12"
        rounded="full"
        bg={option.tint}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2xl"
        lineHeight="1"
        aria-hidden="true"
      >
        {option.emoji}
      </Box>
      <Text fontSize="sm" color="black" whiteSpace="nowrap">
        {option.name}
      </Text>
    </TileButton>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}
