'use client';

import { Button, Text, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <VStack spacing={4} align="stretch" bg="gray.50" p={4} minH="100vh">
      <Text fontSize="2xl">
        If this text is in Geist font and styled by Chakra, it's working!
      </Text>
      {/* A default Chakra button so we know Chakra is wired up */}
      <Button colorScheme="teal" size="lg">
        Teal Button
      </Button>
      {/* Your custom‑theme "brand" button */}
      <Button colorScheme="brand" size="lg" variant="solid">
        Brand Button
      </Button>
    </VStack>
  );
}
