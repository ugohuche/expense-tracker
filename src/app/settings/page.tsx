import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";

import { getCurrentUser } from "@/lib/session";
import { getSettingsData } from "@/lib/settings";
import { AccountSummary } from "./components/account-summary";
import { ChangePasswordForm } from "./components/change-password-form";
import { ProfileForm } from "./components/profile-form";

export const metadata: Metadata = {
  title: "Settings · Expense Tracker",
};

export const instant = false;

export default async function SettingsPage() {
  await connection();

  const user = await getCurrentUser();
  const data = await getSettingsData(user.id);

  if (!data) {
    redirect("/login");
  }

  return (
    <Flex direction="column" gap={6}>
      <Box>
        <Heading as="h1" size="lg" color="brand.navy">
          Settings
        </Heading>
        <Text color="brand.slate" fontSize="sm" mt={1}>
          Manage your profile, currency and password.
        </Text>
      </Box>

      <Grid
        templateColumns={{ base: "1fr", lg: "1.7fr 1fr" }}
        gap={6}
        alignItems="start"
      >
        <Flex direction="column" gap={6}>
          <ProfileForm
            defaultName={data.name}
            defaultFirstName={data.profile.firstName ?? ""}
            defaultLastName={data.profile.lastName ?? ""}
            defaultAvatarUrl={data.profile.avatarUrl ?? ""}
            defaultCurrency={data.profile.currency}
          />
          <ChangePasswordForm />
        </Flex>

        <AccountSummary
          displayName={data.name}
          email={data.email}
          createdAt={data.createdAt}
          currency={data.profile.currency}
        />
      </Grid>
    </Flex>
  );
}
