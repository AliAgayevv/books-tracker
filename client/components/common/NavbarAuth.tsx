"use client";

import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../lib/api/auth";
import { Button } from "./Button";

export function NavbarAuth() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <Flex align="center" gap={3}>
      <Text fontSize="sm" color="fg.muted">
        {user.username}
      </Text>
      <Button size="sm" colorScheme="yellow" variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </Flex>
  );
}
