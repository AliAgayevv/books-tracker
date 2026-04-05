import { Flex, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Navbar,
  PageWrapper,
  Spinner,
} from "../components/common";

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap={4}>
      <Heading as="h2" size="md" color="fg.muted">
        {title}
      </Heading>
      {children}
      <Separator />
    </Stack>
  );
}

export default function ComponentShowcase() {
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
        <Stack gap={12}>
          <Stack gap={1}>
            <Heading as="h1" size="2xl">
              Component Showcase
            </Heading>
            <Text color="fg.muted">All common components with every state and size.</Text>
          </Stack>

          {/* ── Button ────────────────────────────────────────────────────── */}
          <Section title="Button">
            {/* Variants */}
            <Text fontSize="sm" fontWeight="medium">
              Variants
            </Text>
            <Flex gap={3} wrap="wrap">
              <Button colorPalette="blue">Solid</Button>
              <Button variant="outline" colorPalette="blue">
                Outline
              </Button>
              <Button variant="ghost" colorPalette="blue">
                Ghost
              </Button>
              <Button variant="subtle" colorPalette="blue">
                Subtle
              </Button>
            </Flex>

            {/* Sizes */}
            <Text fontSize="sm" fontWeight="medium">
              Sizes
            </Text>
            <Flex gap={3} align="center" wrap="wrap">
              <Button size="xs" colorPalette="blue">
                XSmall
              </Button>
              <Button size="sm" colorPalette="blue">
                Small
              </Button>
              <Button size="md" colorPalette="blue">
                Medium
              </Button>
              <Button size="lg" colorPalette="blue">
                Large
              </Button>
            </Flex>

            {/* States */}
            <Text fontSize="sm" fontWeight="medium">
              States
            </Text>
            <Flex gap={3} wrap="wrap">
              <Button colorPalette="blue" isLoading loadingText="Saving...">
                Loading with text
              </Button>
              <Button colorPalette="blue" isLoading>
                Loading
              </Button>
              <Button colorPalette="blue" disabled>
                Disabled
              </Button>
            </Flex>

            {/* Color palettes */}
            <Text fontSize="sm" fontWeight="medium">
              Color palettes
            </Text>
            <Flex gap={3} wrap="wrap">
              <Button colorPalette="blue">Blue</Button>
              <Button colorPalette="green">Green</Button>
              <Button colorPalette="red">Red</Button>
              <Button colorPalette="orange">Orange</Button>
              <Button colorPalette="gray">Gray</Button>
            </Flex>
          </Section>

          {/* ── Input ─────────────────────────────────────────────────────── */}
          <Section title="Input">
            <Flex gap={6} wrap="wrap">
              <Stack gap={4} flex={1} minW="260px">
                <Text fontSize="sm" fontWeight="medium">
                  States
                </Text>
                <Input id="basic" label="Basic input" placeholder="Search books..." />
                <Input
                  id="helper"
                  label="With helper text"
                  placeholder="Enter ISBN"
                  helperText="10 or 13 digit ISBN"
                />
                <Input
                  id="error"
                  label="With error"
                  placeholder="Enter username"
                  defaultValue="ab"
                  error="Username must be at least 3 characters"
                />
                <Input id="disabled" label="Disabled" placeholder="Not editable" disabled />
              </Stack>

              <Stack gap={4} flex={1} minW="260px">
                <Text fontSize="sm" fontWeight="medium">
                  Sizes
                </Text>
                <Input id="xs" label="XSmall" placeholder="xs input" size="xs" />
                <Input id="sm" label="Small" placeholder="sm input" size="sm" />
                <Input id="md" label="Medium" placeholder="md input" size="md" />
                <Input id="lg" label="Large" placeholder="lg input" size="lg" />
              </Stack>
            </Flex>
          </Section>

          {/* ── Card ──────────────────────────────────────────────────────── */}
          <Section title="Card">
            <Flex gap={4} wrap="wrap" align="start">
              <Card size="sm" flex={1} minW="180px">
                <Text fontWeight="medium">Small card</Text>
                <Text fontSize="sm" color="fg.muted">
                  size="sm"
                </Text>
              </Card>
              <Card size="md" flex={1} minW="180px">
                <Text fontWeight="medium">Medium card</Text>
                <Text fontSize="sm" color="fg.muted">
                  size="md" (default)
                </Text>
              </Card>
              <Card size="lg" flex={1} minW="180px">
                <Text fontWeight="medium">Large card</Text>
                <Text fontSize="sm" color="fg.muted">
                  size="lg"
                </Text>
              </Card>
            </Flex>
          </Section>

          {/* ── Badge ─────────────────────────────────────────────────────── */}
          <Section title="Badge">
            <Text fontSize="sm" fontWeight="medium">
              Book status shorthand
            </Text>
            <Flex gap={3} wrap="wrap">
              <Badge status="want_to_read" />
              <Badge status="currently_reading" />
              <Badge status="read" />
            </Flex>

            <Text fontSize="sm" fontWeight="medium">
              Sizes
            </Text>
            <Flex gap={3} align="center" wrap="wrap">
              <Badge status="read" size="sm" />
              <Badge status="read" size="md" />
              <Badge status="read" size="lg" />
            </Flex>

            <Text fontSize="sm" fontWeight="medium">
              Manual color palettes
            </Text>
            <Flex gap={3} wrap="wrap">
              <Badge colorPalette="purple">Fantasy</Badge>
              <Badge colorPalette="teal">Science</Badge>
              <Badge colorPalette="pink">Romance</Badge>
              <Badge colorPalette="yellow">Biography</Badge>
            </Flex>
          </Section>

          {/* ── Spinner ───────────────────────────────────────────────────── */}
          <Section title="Spinner">
            <Text fontSize="sm" fontWeight="medium">
              Sizes
            </Text>
            <Flex gap={6} align="center">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </Flex>

            <Text fontSize="sm" fontWeight="medium">
              With label
            </Text>
            <Spinner size="md" label="Loading books..." />
          </Section>

          {/* ── EmptyState ────────────────────────────────────────────────── */}
          <Section title="EmptyState">
            <Flex gap={6} wrap="wrap">
              <Card flex={1} minW="220px" size="sm">
                <EmptyState
                  size="sm"
                  icon={<span>📚</span>}
                  title="No books yet"
                  description="Start by searching for a book."
                  action={
                    <Button size="sm" colorPalette="blue">
                      Search
                    </Button>
                  }
                />
              </Card>
              <Card flex={1} minW="220px" size="sm">
                <EmptyState
                  size="md"
                  icon={<span>🔍</span>}
                  title="No results found"
                  description="Try a different title or author."
                />
              </Card>
              <Card flex={1} minW="220px" size="sm">
                <EmptyState size="sm" title="Nothing here" />
              </Card>
            </Flex>
          </Section>

          {/* ── PageWrapper ───────────────────────────────────────────────── */}
          <Section title="PageWrapper">
            <Text fontSize="sm" color="fg.muted">
              This whole page is wrapped in{" "}
              <Text
                as="span"
                fontFamily="mono"
                fontSize="xs"
                bg="bg.subtle"
                px={1}
                borderRadius="sm"
              >
                {'<PageWrapper size="lg">'}
              </Text>
              . Other sizes: <strong>sm</strong> (2xl), <strong>md</strong> (4xl),{" "}
              <strong>lg</strong> (6xl), <strong>full</strong>.
            </Text>
          </Section>
        </Stack>
      </PageWrapper>
    </>
  );
}
