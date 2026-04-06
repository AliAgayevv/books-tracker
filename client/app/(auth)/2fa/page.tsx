import type { Metadata } from "next";
import { Stack, Heading, Text } from "@chakra-ui/react";
import { Card } from "../../../components/common";
import TwoFactorSection from "../../../sections/TwoFactorSection";

export const metadata: Metadata = { title: "Two-factor authentication" };

export default function TwoFactorPage() {
  return (
    <Card size="lg">
      <Stack gap={6}>
        <Stack gap={1} textAlign="center">
          <Heading as="h1" size="lg">
            Two-factor authentication
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            Enter the 6-digit code from your authenticator app.
          </Text>
        </Stack>

        <TwoFactorSection />
      </Stack>
    </Card>
  );
}
