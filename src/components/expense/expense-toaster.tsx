"use client";

import { Toast, Toaster, createToaster } from "@chakra-ui/react";

import { COLORS } from "./colors";

export const expenseToaster = createToaster({
  placement: "bottom-end",
  duration: 4000,
  removeDelay: 200,
});

export function ExpenseToaster() {
  return (
    <Toaster toaster={expenseToaster} zIndex="9999">
      {(toast) => {
        const isError = toast.type === "error";

        return (
          <Toast.Root
            bg={COLORS.card}
            color={COLORS.text}
            borderWidth="1px"
            borderColor={
              isError ? COLORS.dangerBorder : COLORS.successBorder
            }
            borderRadius="lg"
            boxShadow="lg"
            ps={4}
            pe={8}
            py={3}
          >
            <Toast.Indicator
              color={isError ? COLORS.danger : COLORS.success}
            />
            <Toast.Title fontSize="sm" fontWeight="medium">
              {toast.title}
            </Toast.Title>
            <Toast.CloseTrigger
              color={COLORS.muted}
              aria-label="Dismiss notification"
            />
          </Toast.Root>
        );
      }}
    </Toaster>
  );
}
