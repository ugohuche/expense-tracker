import { Box } from "@chakra-ui/react";

import { COLORS } from "@/components/expense/colors";
import { ExpenseForm } from "@/components/expense/expense-form";
import { surfaceStyles } from "@/components/expense/styles";

export default function ExpenseFormPage() {
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
        <ExpenseForm />
      </Box>
    </Box>
  );
}
