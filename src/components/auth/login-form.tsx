"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Field, Input, Stack, Text } from "@chakra-ui/react";

import { login } from "@/lib/actions/auth";

const inputStyles = {
  borderColor: "brand.mist",
  focusRingColor: "brand.teal",
  _invalid: {
    borderColor: "brand.red",
    focusRingColor: "brand.red",
  },
} as const;

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  return (
    <form action={formAction}>
      <Stack gap={4}>
        {justRegistered ? (
          <Text
            aria-live="polite"
            bg="brand.green/10"
            borderRadius="lg"
            color="brand.green"
            fontSize="sm"
            fontWeight="medium"
            px={3}
            py={2}
          >
            Account created. You can log in now.
          </Text>
        ) : null}

        <Field.Root invalid={Boolean(state?.errors?.email)}>
          <Field.Label htmlFor="email">Email</Field.Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...inputStyles}
            aria-invalid={state?.errors?.email ? true : undefined}
          />
          <Field.ErrorText aria-live="polite">
            {state?.errors?.email?.[0]}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={Boolean(state?.errors?.password)}>
          <Field.Label htmlFor="password">Password</Field.Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...inputStyles}
            aria-invalid={state?.errors?.password ? true : undefined}
          />
          <Field.ErrorText aria-live="polite">
            {state?.errors?.password?.[0]}
          </Field.ErrorText>
        </Field.Root>

        {state?.message ? (
          <Text aria-live="polite" color="brand.red" fontSize="sm">
            {state.message}
          </Text>
        ) : null}

        <Button
          type="submit"
          loading={pending}
          loadingText="Logging in…"
          mt={1}
          w="full"
          h={11}
          borderRadius="full"
          bg="brand.teal"
          color="white"
          fontSize="sm"
          fontWeight="medium"
          _hover={{ bg: "brand.teal", opacity: 0.9 }}
          _active={{ opacity: 0.8 }}
        >
          Log in
        </Button>
      </Stack>
    </form>
  );
}
