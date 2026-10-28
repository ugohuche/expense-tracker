"use client";

import { useState } from "react";
import { Box, IconButton, Input, type InputProps } from "@chakra-ui/react";

import { EyeIcon, EyeOffIcon } from "@/components/shared/icons";

/**
 * A password `Input` with a show/hide toggle inside its right edge. Accepts
 * every `Input` prop except `type`, which the toggle controls.
 */
export default function PasswordInput(props: Omit<InputProps, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <Box position="relative" w="full">
      <Input {...props} type={visible ? "text" : "password"} pe={11} />
      <IconButton
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={props.id}
        onClick={() => setVisible((current) => !current)}
        position="absolute"
        top="50%"
        right={1}
        transform="translateY(-50%)"
        zIndex={1}
        size="sm"
        variant="ghost"
        borderRadius="full"
        color="brand.slate"
        _hover={{ bg: "brand.soft-white", color: "brand.navy" }}
        _focusVisible={{
          outline: "2px solid",
          outlineColor: "brand.teal",
          outlineOffset: "1px",
        }}
      >
        {visible ? <EyeIcon /> : <EyeOffIcon />}
      </IconButton>
    </Box>
  );
}
