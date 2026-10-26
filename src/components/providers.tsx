"use client";

import { ChakraProvider } from "@chakra-ui/react";
import createCache, { type EmotionCache } from "@emotion/cache";
import { css } from "@emotion/react";
import type { ReactNode } from "react";

import { system } from "@/lib/theme";

const cache = createCache({ key: "chakra-globals" });
type CacheSheet = Parameters<EmotionCache["insert"]>[2];

function hasLayerStyles(styles: (typeof system._global)[number]) {
  return Object.values(styles).some(
    (value) =>
      value !== null &&
      typeof value === "object" &&
      Object.keys(value).length > 0,
  );
}

const globalStyles = (() => {
  let captured = "";
  const sheet = {
    insert: (rule: string) => {
      captured += rule;
    },
  } as unknown as CacheSheet;

  const synthesized = cache.insert(
    "",
    css([system.layers.atRule, ...system._global.filter(hasLayerStyles)]),
    sheet,
    false,
  );

  return typeof synthesized === "string" ? synthesized : captured;
})();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <style
        href="chakra-globals"
        precedence="default"
        dangerouslySetInnerHTML={{ __html: globalStyles }}
      />
      {children}
    </ChakraProvider>
  );
}
