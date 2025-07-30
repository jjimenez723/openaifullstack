import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "var(--font-geist-sans)",
    body: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
  colors: {
    brand: {
      50: "#e3f2ff",
      100: "#b3daff",
      200: "#81c0ff",
      300: "#4ea6ff",
      400: "#1b8cff",
      500: "#006ddb",
      600: "#0051aa",
      700: "#003778",
      800: "#001c47",
      900: "#000318",
    },
  },
  components: {
    Button: {
      variants: {
        solid: (props: { colorScheme: string }) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: props.colorScheme === 'brand' ? 'white' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          }
        })
      }
    }
  },
});

export default theme;
