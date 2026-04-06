import { Heading, Stack, Text } from "@chakra-ui/react";
import { Navbar, PageWrapper } from "../../components/common";
import SearchSection from "../../sections/SearchSection";

export default function SearchPage() {
  return (
    <>
      <Navbar
        brand="Books Tracker"
        items={[
          { label: "Search", href: "/search" },
          { label: "My Books", href: "/books" },
          { label: "Profile", href: "/profile" },
        ]}
      />

      <PageWrapper size="lg">
        <Stack gap={8}>
          <Stack gap={1}>
            <Heading as="h1" size="xl">
              Search Books
            </Heading>
            <Text color="fg.muted">Find books by title, author, or ISBN.</Text>
          </Stack>

          <SearchSection />
        </Stack>
      </PageWrapper>
    </>
  );
}
