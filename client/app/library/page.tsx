import { Heading, Stack, Text } from "@chakra-ui/react";
import { Navbar, PageWrapper } from "../../components/common";
import LibrarySection from "../../sections/LibrarySection";

export const metadata = { title: "My Library" };

export default function LibraryPage() {
  return (
    <>
      <Navbar
        brand="Books Tracker"
        items={[
          { label: "Search", href: "/search" },
          { label: "My Library", href: "/library" },
        ]}
      />

      <PageWrapper size="lg">
        <Stack gap={8}>
          <Stack gap={1}>
            <Heading as="h1" size="xl">
              My Library
            </Heading>
            <Text color="fg.muted">All the books you are tracking.</Text>
          </Stack>

          <LibrarySection />
        </Stack>
      </PageWrapper>
    </>
  );
}
