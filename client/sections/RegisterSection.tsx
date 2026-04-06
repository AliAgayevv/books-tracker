"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stack, Text, Flex } from "@chakra-ui/react";
import { Mail, User as UserIcon } from "lucide-react";
import { register } from "../lib/api/auth";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/common";

export default function RegisterSection() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await register(username, email, password);
      setUser(user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldStyle = (hasError: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "12px",
    background: hasError ? "#FFF5F5" : "#F9F9F9",
    border: hasError ? "1.5px solid #DC2626" : "1.5px solid transparent",
    transition: "border 0.15s ease",
  });

  const inputStyle: React.CSSProperties = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#111827",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Stack gap={5}>
        {/* Username */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="username" style={labelStyle}>
            Username
          </label>
          <div style={fieldStyle(false)}>
            <UserIcon size={18} color="#374151" strokeWidth={1.8} />
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={30}
              required
              disabled={isLoading}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <div style={fieldStyle(false)}>
            <Mail size={18} color="#374151" strokeWidth={1.8} />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <Input
            id="password"
            name="password"
            placeholder="Min. 8 characters"
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
          loadingText="Creating account…"
        >
          Create account
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
          <Button type="button" colorScheme="yellow" variant="outline" fullWidth>
            Continue with Google
          </Button>
        </a>

        {/* Login link */}
        <Text fontSize="sm" textAlign="center" color="#6B7280">
          Already have an account?{" "}
          <a href="/login" style={{ color: "#8D43FF", fontWeight: 600 }}>
            Sign in
          </a>
        </Text>
      </Stack>
    </form>
  );
}
