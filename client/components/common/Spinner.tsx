"use client";

import { Flex, Spinner as ChakraSpinner, Text } from "@chakra-ui/react";
import type { SpinnerProps as ChakraSpinnerProps } from "@chakra-ui/react";

interface SpinnerProps extends ChakraSpinnerProps {
  label?: string;
  fullPage?: boolean;
}

export function Spinner({ label, fullPage, size = "md", ...props }: SpinnerProps) {
  if (fullPage) {
    return (
      <Flex align="center" justify="center" minH="60vh" direction="column" gap={3}>
        <ChakraSpinner size={size} {...props} />
        {label && (
          <Text fontSize="sm" color="fg.muted">
            {label}
          </Text>
        )}
      </Flex>
    );
  }

  return <ChakraSpinner size={size} {...props} />;
}