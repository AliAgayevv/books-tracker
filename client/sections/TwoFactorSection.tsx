"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Stack, Text } from "@chakra-ui/react";
import { verifyTwoFactor } from "../lib/api/auth";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common";

export default function TwoFactorSection() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = digits.join("");
    if (token.length !== 6) return;

    setError(null);
    setIsLoading(true);

    try {
      const user = await verifyTwoFactor(token);
      setUser(user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const token = digits.join("");

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Stack gap={6} align="center">
        {/* Digit inputs */}
        <div style={{ display: "flex", gap: "10px" }} onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isLoading}
              style={{
                width: "48px",
                height: "56px",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: 600,
                fontFamily: "inherit",
                borderRadius: "12px",
                background: error ? "#FFF5F5" : "#F9F9F9",
                border: error
                  ? "1.5px solid #DC2626"
                  : digit
                    ? "1.5px solid #8D43FF"
                    : "1.5px solid transparent",
                outline: "none",
                color: "#111827",
                transition: "border 0.15s ease",
              }}
            />
          ))}
        </div>

        {error && (
          <Text fontSize="sm" color="#DC2626">
            {error}
          </Text>
        )}

        <Button
          type="submit"
          colorScheme="purple"
          fullWidth
          disabled={token.length !== 6}
          isLoading={isLoading}
          loadingText="Verifying…"
        >
          Verify
        </Button>

        <Text fontSize="sm" color="#6B7280">
          <a href="/login" style={{ color: "#8D43FF", fontWeight: 600 }}>
            Back to login
          </a>
        </Text>
      </Stack>
    </form>
  );
}
