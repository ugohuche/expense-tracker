"use client";

import { useActionState } from "react";
import {
  Box,
  Button,
  Field,
  Grid,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";

import { updateProfile } from "@/lib/actions/settings";
import { CURRENCY_OPTIONS } from "@/lib/currency";

interface ProfileFormProps {
  defaultName: string;
  defaultFirstName: string;
  defaultLastName: string;
  defaultAvatarUrl: string;
  defaultCurrency: string;
}

const inputStyles = {
  borderColor: "brand.mist",
  focusRingColor: "brand.teal",
  _invalid: {
    borderColor: "brand.red",
    focusRingColor: "brand.red",
  },
} as const;

export function ProfileForm({
  defaultName,
  defaultFirstName,
  defaultLastName,
  defaultAvatarUrl,
  defaultCurrency,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  const currencyOptions = CURRENCY_OPTIONS.some(
    (option) => option.value === defaultCurrency,
  )
    ? CURRENCY_OPTIONS
    : [{ value: defaultCurrency, label: defaultCurrency }, ...CURRENCY_OPTIONS];

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
        Profile
      </Heading>
      <Text color="brand.slate" fontSize="sm" mt={1}>
        Update the details used across your dashboard.
      </Text>

      <form action={formAction}>
        <Stack gap={4} mt={5}>
          <Field.Root invalid={Boolean(state?.errors?.name)}>
            <Field.Label htmlFor="name">Display name</Field.Label>
            <Input
              id="name"
              name="name"
              defaultValue={defaultName}
              autoComplete="name"
              {...inputStyles}
              aria-invalid={state?.errors?.name ? true : undefined}
            />
            <Field.ErrorText aria-live="polite">
              {state?.errors?.name?.[0]}
            </Field.ErrorText>
          </Field.Root>

          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
            <Field.Root invalid={Boolean(state?.errors?.firstName)}>
              <Field.Label htmlFor="firstName">First name</Field.Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={defaultFirstName}
                autoComplete="given-name"
                placeholder="Optional"
                {...inputStyles}
                aria-invalid={state?.errors?.firstName ? true : undefined}
              />
              <Field.ErrorText aria-live="polite">
                {state?.errors?.firstName?.[0]}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={Boolean(state?.errors?.lastName)}>
              <Field.Label htmlFor="lastName">Last name</Field.Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={defaultLastName}
                autoComplete="family-name"
                placeholder="Optional"
                {...inputStyles}
                aria-invalid={state?.errors?.lastName ? true : undefined}
              />
              <Field.ErrorText aria-live="polite">
                {state?.errors?.lastName?.[0]}
              </Field.ErrorText>
            </Field.Root>
          </Grid>

          <Field.Root invalid={Boolean(state?.errors?.avatarUrl)}>
            <Field.Label htmlFor="avatarUrl">Avatar URL</Field.Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              defaultValue={defaultAvatarUrl}
              placeholder="https://example.com/avatar.png"
              {...inputStyles}
              aria-invalid={state?.errors?.avatarUrl ? true : undefined}
            />
            <Field.ErrorText aria-live="polite">
              {state?.errors?.avatarUrl?.[0]}
            </Field.ErrorText>
            <Field.HelperText>
              Paste a link to an image to personalise your avatar.
            </Field.HelperText>
          </Field.Root>

          <Field.Root invalid={Boolean(state?.errors?.currency)}>
            <Field.Label htmlFor="currency">Currency</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                id="currency"
                name="currency"
                defaultValue={defaultCurrency}
                {...inputStyles}
                aria-invalid={state?.errors?.currency ? true : undefined}
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText aria-live="polite">
              {state?.errors?.currency?.[0]}
            </Field.ErrorText>
            <Field.HelperText>
              Amounts across the app are shown in this currency.
            </Field.HelperText>
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
            loadingText="Saving…"
            w="fit-content"
            borderRadius="full"
            bg="brand.teal"
            color="white"
            fontSize="sm"
            fontWeight="medium"
            _hover={{ bg: "brand.teal", opacity: 0.9 }}
            _active={{ opacity: 0.8 }}
          >
            Save changes
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
