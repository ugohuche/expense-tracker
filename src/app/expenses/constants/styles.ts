import { COLORS } from "./colors";

export const focusRing = {
  outline: "2px solid",
  outlineColor: COLORS.gold,
  outlineOffset: "2px",
} as const;

export const surfaceStyles = {
  bg: COLORS.card,
  borderWidth: "1px",
  borderColor: COLORS.border,
  borderRadius: "xl",
} as const;

export const dialogSurfaceStyles = {
  ...surfaceStyles,
  p: { base: 5, md: 6 },
  shadow: "lg",
  outline: "none",
} as const;

export const controlStyles = {
  h: { base: "11", sm: "10" },
  bg: COLORS.raised,
  borderWidth: "1px",
  borderColor: COLORS.border,
  borderRadius: "lg",
  color: COLORS.text,
  fontSize: "sm",
  _placeholder: { color: COLORS.subtle },
  _hover: { borderColor: COLORS.borderStrong },
  _focusVisible: {
    borderColor: COLORS.gold,
    outlineColor: COLORS.gold,
  },
} as const;

export const nativeSelectOptionStyles = {
  "& option": {
    backgroundColor: COLORS.card,
    color: COLORS.text,
  },
} as const;

export const primaryButtonStyles = {
  h: { base: "11", sm: "10" },
  px: 4,
  borderRadius: "lg",
  bg: COLORS.gold,
  color: COLORS.onAccent,
  fontSize: "sm",
  fontWeight: "semibold",
  _hover: { bg: COLORS.goldHover },
  _active: { bg: COLORS.goldActive },
  _focusVisible: focusRing,
  _disabled: { opacity: 0.6, cursor: "not-allowed" },
} as const;

export const secondaryButtonStyles = {
  h: { base: "11", sm: "10" },
  px: 4,
  variant: "outline",
  bg: COLORS.raised,
  borderColor: COLORS.border,
  borderRadius: "lg",
  color: COLORS.text,
  fontSize: "sm",
  fontWeight: "medium",
  _hover: { bg: COLORS.raisedHover, borderColor: COLORS.borderStrong },
  _active: { bg: COLORS.raised },
  _focusVisible: focusRing,
} as const;

export const dangerButtonStyles = {
  h: { base: "11", sm: "10" },
  px: 4,
  borderRadius: "lg",
  bg: COLORS.red,
  color: COLORS.onDanger,
  fontSize: "sm",
  fontWeight: "semibold",
  _hover: { bg: COLORS.redHover },
  _active: { bg: COLORS.redActive },
  _focusVisible: focusRing,
} as const;

export const dangerOutlineButtonStyles = {
  h: { base: "11", sm: "10" },
  px: 4,
  variant: "outline",
  bg: COLORS.dangerSurface,
  borderColor: COLORS.dangerBorder,
  borderRadius: "lg",
  color: COLORS.red,
  fontSize: "sm",
  fontWeight: "semibold",
  _hover: { bg: COLORS.dangerSurfaceHover },
  _active: { bg: COLORS.dangerSurfaceActive },
  _focusVisible: focusRing,
} as const;

export const metaLabelStyles = {
  fontSize: "xs",
  fontWeight: "medium",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: COLORS.muted,
} as const;

export const tableHeaderStyles = {
  ...metaLabelStyles,
  fontSize: "11px",
  bg: COLORS.raised,
  py: 3,
} as const;
