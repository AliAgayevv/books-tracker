import type { Metadata } from "next";
import { Stack, Heading, Text } from "@chakra-ui/react";
import { Card } from "../../../components/common";
import RegisterSection from "../../../sections/RegisterSection";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <Card size="lg">
      <Stack gap={6}>
        <Stack gap={1}>
          <Heading as="h1" size="lg">
            Create account
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            Start tracking your reading journey.
          </Text>
        </Stack>

        <RegisterSection />
      </Stack>
    </Card>
  );
}
