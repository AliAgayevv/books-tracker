"use client";

import { Badge as ChakraBadge } from "@chakra-ui/react";
import type { BadgeProps as ChakraBadgeProps } from "@chakra-ui/react";

type BookStatus = "want_to_read" | "currently_reading" | "read";

const statusConfig: Record<BookStatus, { label: string; colorPalette: string }> = {
  want_to_read: { label: "Want to Read", colorPalette: "blue" },
  currently_reading: { label: "Reading", colorPalette: "orange" },
  read: { label: "Read", colorPalette: "green" },
};

interface BadgeProps extends Omit<ChakraBadgeProps, "colorPalette"> {
  status?: BookStatus;
  colorPalette?: string;
  size?: "sm" | "md" | "lg";
}

export function Badge({ status, colorPalette, size = "sm", children, ...props }: BadgeProps) {
  if (status) {
    const config = statusConfig[status];
    return (
      <ChakraBadge colorPalette={config.colorPalette} size={size} {...props}>
        {config.label}
      </ChakraBadge>
    );
  }

  return (
    <ChakraBadge colorPalette={colorPalette} size={size} {...props}>
      {children}
    </ChakraBadge>
  );
}
