import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  preflight: false,
  theme: {
    tokens: {
      colors: {
        brand: {
          navy: { value: "#0B2545" },
          teal: { value: "#0E8388" },
          gold: { value: "#F2A900" },
          green: { value: "#1B9E5A" },
          red: { value: "#E4572E" },
          "soft-white": { value: "#F7F9FB" },
          mist: { value: "#E2E8F0" },
          slate: { value: "#5B6B7F" },
        },
      },
    },
    semanticTokens: {
      colors: {
        fg: {
          muted: { value: "{colors.brand.slate}" },
          error: { value: "{colors.brand.red}" },
        },
        border: {
          error: { value: "{colors.brand.red}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);


