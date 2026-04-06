"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "system-ui, sans-serif" },
        body: { value: "system-ui, sans-serif" },
        mono: { value: "var(--font-geist-mono), monospace" },
      },
    },
  },
});

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ThemeProvider>
  );
}
