"use client";

import { Button as ChakraButton, Spinner } from "@chakra-ui/react";
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";

interface ButtonProps extends ChakraButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({ isLoading, loadingText, children, disabled, ...props }: ButtonProps) {
  return (
    <ChakraButton disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <Spinner size="sm" mr={2} />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </ChakraButton>
  );
}
