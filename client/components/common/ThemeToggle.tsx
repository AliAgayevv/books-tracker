"use client";
import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";

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
export default ThemeToggle;
