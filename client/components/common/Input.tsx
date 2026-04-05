"use client";

import { Field, Input as ChakraInput } from "@chakra-ui/react";
import type { InputProps as ChakraInputProps } from "@chakra-ui/react";

interface InputProps extends ChakraInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, id, ...props }: InputProps) {
  return (
    <Field.Root invalid={!!error}>
      {label && <Field.Label htmlFor={id}>{label}</Field.Label>}
      <ChakraInput id={id} {...props} />
      {error ? (
        <Field.ErrorText>{error}</Field.ErrorText>
      ) : helperText ? (
        <Field.HelperText>{helperText}</Field.HelperText>
      ) : null}
    </Field.Root>
  );
}
