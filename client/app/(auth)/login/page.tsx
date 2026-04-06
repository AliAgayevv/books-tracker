import type { Metadata } from "next";
import { Stack, Heading, Text } from "@chakra-ui/react";
import { Card } from "../../../components/common";
import LoginSection from "../../../sections/LoginSection";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Card size="lg">
      <Stack gap={6}>
        <Stack gap={1}>
          <Heading as="h1" size="lg">
            Welcome back
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            Sign in to your Books Tracker account.
          </Text>
        </Stack>

        <LoginSection />
      </Stack>
    </Card>
  );
}
