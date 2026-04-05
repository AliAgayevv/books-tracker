"use client";

import { Button as ChakraButton } from "@chakra-ui/react";
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";

interface ButtonProps extends ChakraButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

const spinnerStyles = `
  @keyframes spin-ease-in {
    0%   { transform: rotate(0deg);   animation-timing-function: cubic-bezier(0.4, 0, 1, 1); }
    40%  { transform: rotate(90deg);  animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1); }
    100% { transform: rotate(360deg); }
  }
  .btn-spinner {
    animation: spin-ease-in 1s infinite;
  }
`;

function ButtonSpinner() {
  return (
    <>
      <style>{spinnerStyles}</style>
      <svg
        className="btn-spinner"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ marginRight: "8px", flexShrink: 0 }}
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
        <path
          d="M14 8a6 6 0 0 0-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

export function Button({ isLoading, loadingText, children, disabled, ...props }: ButtonProps) {
  return (
    <ChakraButton disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <ButtonSpinner />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </ChakraButton>
  );
}
