"use client";

import { Box, Flex, HStack, Text, IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  brand?: string;
  items?: NavItem[];
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <IconButton
      aria-label="Toggle color mode"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? "☀️" : "🌙"}
    </IconButton>
  );
}

export function Navbar({ brand = "Books Tracker", items = [] }: NavbarProps) {
  return (
    <Box
      as="nav"
      borderBottomWidth="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      bg={{ base: "white", _dark: "gray.900" }}
      px={{ base: 4, md: 8 }}
      py={3}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Flex align="center" justify="space-between" maxW="6xl" mx="auto">
        <Link href="/" style={{ textDecoration: "none" }}>
          <Text fontWeight="bold" fontSize="lg">
            {brand}
          </Text>
        </Link>

        <HStack gap={6}>
          {items.map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <Text fontSize="sm" fontWeight="medium" _hover={{ opacity: 0.7 }}>
                {item.label}
              </Text>
            </Link>
          ))}
          <ThemeToggle />
        </HStack>
      </Flex>
    </Box>
  );
}