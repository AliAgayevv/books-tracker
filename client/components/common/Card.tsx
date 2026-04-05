"use client";

import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  size?: "sm" | "md" | "lg";
}

const paddingBySize = {
  sm: 4,
  md: 6,
  lg: 8,
} as const;

export function Card({ size = "md", children, ...props }: CardProps) {
  return (
    <Box
      bg={{ base: "white", _dark: "gray.800" }}
      borderWidth="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      borderRadius="xl"
      p={paddingBySize[size]}
      shadow="sm"
      {...props}
    >
      {children}
    </Box>
  );
}
