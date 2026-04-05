"use client";

import { Flex, Text, Box } from "@chakra-ui/react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const gapBySize = { sm: 2, md: 4, lg: 6 } as const;
const iconSizeBySize = { sm: "6", md: "10", lg: "14" } as const;

export function EmptyState({ title, description, icon, action, size = "md" }: EmptyStateProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap={gapBySize[size]}
      py={size === "lg" ? 20 : size === "md" ? 12 : 6}
      textAlign="center"
    >
      {icon && (
        <Box fontSize={iconSizeBySize[size]} color="fg.muted">
          {icon}
        </Box>
      )}
      <Flex direction="column" gap={1}>
        <Text fontWeight="semibold" fontSize={size === "lg" ? "xl" : "md"}>
          {title}
        </Text>
        {description && (
          <Text fontSize="sm" color="fg.muted">
            {description}
          </Text>
        )}
      </Flex>
      {action}
    </Flex>
  );
}