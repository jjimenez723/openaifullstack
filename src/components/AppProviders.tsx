"use client";

import { ReactNode } from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/app/Theme";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} resetCSS>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
