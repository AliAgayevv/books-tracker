"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stack, Text, Flex } from "@chakra-ui/react";
import { Mail } from "lucide-react";
import { login } from "../lib/api/auth";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/common";
import type { User } from "../types";

export default function LoginSection() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if ("twoFactorRequired" in result && result.twoFactorRequired) {
        router.push("/2fa");
        return;
      }

      setUser(result as User);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Stack gap={5}>
        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="email" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            Email
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "#F9F9F9",
              border: error ? "1.5px solid #DC2626" : "1.5px solid transparent",
              transition: "border 0.15s ease",
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.border = "1.5px solid #7C3AED";
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.border = "1.5px solid transparent";
            }}
          >
            <Mail size={18} color="#374151" strokeWidth={1.8} />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "15px",
                color: "#111827",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="password" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            Password
          </label>
          <Input
            id="password"
            name="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            state={error ? "error" : "default"}
            disabled={isLoading}
          />
        </div>

        {/* Error */}
        {error && (
          <Text fontSize="sm" color="#DC2626">
            {error}
          </Text>
        )}

        {/* Submit */}
        <Button
          type="submit"
          colorScheme="purple"
          fullWidth
          isLoading={isLoading}
          loadingText="Signing in…"
        >
          Sign in
        </Button>

        {/* Divider */}
        <Flex align="center" gap={3}>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          <Text fontSize="xs" color="#9CA3AF">
            or
          </Text>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
        </Flex>

        {/* Google OAuth */}
        <a href="/api/auth/google" style={{ textDecoration: "none" }}>
          <Button type="button" colorScheme="purple[" variant="outline" fullWidth>
            Continue with Google
          </Button>
        </a>

        {/* Register link */}
        <Text fontSize="sm" textAlign="center" color="#6B7280">
          Don&apos;t have an account?{" "}
          <a href="/register" style={{ color: "#8D43FF", fontWeight: 600 }}>
            Sign up
          </a>
        </Text>
      </Stack>
    </form>
  );
}
