import { Flex, Box } from "@chakra-ui/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100vh" align="center" justify="center" bg={{ base: "gray.50", _dark: "gray.950" }}>
      <Box w="full" maxW="400px" px={4}>
        {children}
      </Box>
    </Flex>
  );
}
