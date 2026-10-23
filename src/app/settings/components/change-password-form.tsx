"use client";

import { useActionState } from "react";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { changePassword } from "@/lib/actions/settings";

const inputStyles = {
  borderColor: "brand.mist",
  focusRingColor: "brand.teal",
  _invalid: {
    borderColor: "brand.red",
    focusRingColor: "brand.red",
  },
} as const;

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    undefined,
  );

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.mist"
      borderRadius="2xl"
      boxShadow="sm"
      p={5}
    >
      <Heading as="h2" size="md" color="brand.navy">
        Password
      </Heading>
      <Text color="brand.slate" fontSize="sm" mt={1}>
        Choose a strong password you do not use anywhere else.
      </Text>

      <form action={formAction}>
        <Stack gap={4} mt={5}>
          <Field.Root invalid={Boolean(state?.errors?.currentPassword)}>
            <Field.Label htmlFor="currentPassword">
              Current password
            </Field.Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...inputStyles}
              aria-invalid={state?.errors?.currentPassword ? true : undefined}
            />
            <Field.ErrorText aria-live="polite">
              {state?.errors?.currentPassword?.[0]}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={Boolean(state?.errors?.newPassword)}>
            <Field.Label htmlFor="newPassword">New password</Field.Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...inputStyles}
              aria-invalid={state?.errors?.newPassword ? true : undefined}
            />
            <Field.ErrorText aria-live="polite">
              {state?.errors?.newPassword?.[0]}
            </Field.ErrorText>
            <Field.HelperText>
              At least 8 characters with a letter, a number and a special
              character.
            </Field.HelperText>
          </Field.Root>

          <Field.Root invalid={Boolean(state?.errors?.confirmPassword)}>
            <Field.Label htmlFor="confirmPassword">
              Confirm new password
            </Field.Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...inputStyles}
              aria-invalid={state?.errors?.confirmPassword ? true : undefined}
            />
            <Field.ErrorText aria-live="polite">
              {state?.errors?.confirmPassword?.[0]}
            </Field.ErrorText>
          </Field.Root>

          {state?.message ? (
            <Text
              aria-live="polite"
              color={state.status === "error" ? "brand.red" : "brand.green"}
              fontSize="sm"
              fontWeight="medium"
            >
              {state.message}
            </Text>
          ) : null}

          <Button
            type="submit"
            loading={pending}
            loadingText="Updating…"
            w="fit-content"
            borderRadius="full"
            bg="brand.teal"
            color="white"
            fontSize="sm"
            fontWeight="medium"
            _hover={{ bg: "brand.teal", opacity: 0.9 }}
            _active={{ opacity: 0.8 }}
          >
            Update password
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
