"use client";

import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

interface PageWrapperProps extends BoxProps {
  size?: "sm" | "md" | "lg" | "full";
}

const maxWidthBySize = {
  sm: "2xl",
  md: "4xl",
  lg: "6xl",
  full: "full",
} as const;

export function PageWrapper({ size = "lg", children, ...props }: PageWrapperProps) {
  return (
    <Box
      as="main"
      maxW={maxWidthBySize[size]}
      mx="auto"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 10 }}
      w="full"
      {...props}
    >
      {children}
    </Box>
  );
}