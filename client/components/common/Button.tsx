"use client";

import type { ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type ColorScheme = "purple" | "yellow";
type Variant = "solid" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children?: ReactNode;
  colorScheme?: ColorScheme;
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

// ── Tokens ─────────────────────────────────────────────────────────────────────

const tokens = {
  purple: {
    solid: {
      bg: "#8D43FF",
      text: "#FFFFFF",
      hover: "#7A35EB",
      disabledBg: "#C49AFF",
      disabledText: "rgba(255,255,255,0.6)",
    },
    outline: {
      border: "#8D43FF",
      text: "#8D43FF",
      hoverBg: "rgba(141,67,255,0.08)",
      disabledBorder: "#C49AFF",
      disabledText: "#C49AFF",
    },
  },
  yellow: {
    solid: {
      bg: "#E6FF02",
      text: "#111111",
      hover: "#D0E800",
      disabledBg: "#F0FF80",
      disabledText: "rgba(17,17,17,0.45)",
    },
    outline: {
      border: "#E6FF02",
      text: "#E6FF02",
      hoverBg: "rgba(230,255,2,0.1)",
      disabledBorder: "#C8DC60",
      disabledText: "#C8DC60",
    },
  },
} as const;

const sizeTokens: Record<Size, { padding: string; fontSize: string; borderRadius: string; gap: string }> = {
  sm: { padding: "7px 14px", fontSize: "13px", borderRadius: "10px", gap: "6px" },
  md: { padding: "11px 20px", fontSize: "15px", borderRadius: "12px", gap: "8px" },
  lg: { padding: "14px 26px", fontSize: "16px", borderRadius: "12px", gap: "8px" },
};

// ── Spinner ────────────────────────────────────────────────────────────────────

const spinnerCSS = `
  @keyframes spin-ease-in {
    0%   { transform: rotate(0deg);   animation-timing-function: cubic-bezier(0.4,0,1,1); }
    40%  { transform: rotate(90deg);  animation-timing-function: cubic-bezier(0.2,0,0.8,1); }
    100% { transform: rotate(360deg); }
  }
  .btn-spinner { animation: spin-ease-in 1s infinite; }
`;

function ButtonSpinner({ color }: { color: string }) {
  return (
    <>
      <style>{spinnerCSS}</style>
      <svg
        className="btn-spinner"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <circle cx="8" cy="8" r="6" stroke={color} strokeOpacity="0.3" strokeWidth="2" />
        <path d="M14 8a6 6 0 0 0-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Button({
  children,
  colorScheme = "purple",
  variant = "solid",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading,
  loadingText,
  disabled,
  onClick,
  type = "button",
  fullWidth,
}: ButtonProps) {
  const t = tokens[colorScheme][variant];
  const s = sizeTokens[size];
  const isDisabled = isLoading || disabled;

  // Build dynamic styles based on variant / colorScheme / disabled
  let baseStyle: React.CSSProperties;

  if (variant === "solid") {
    const st = tokens[colorScheme].solid;
    baseStyle = {
      background: isDisabled ? st.disabledBg : st.bg,
      color: isDisabled ? st.disabledText : st.text,
      border: "none",
    };
  } else {
    const ot = tokens[colorScheme].outline;
    baseStyle = {
      background: "transparent",
      color: isDisabled ? ot.disabledText : ot.text,
      border: `1.5px solid ${isDisabled ? ot.disabledBorder : ot.border}`,
    };
  }

  // We use a unique class per colorScheme+variant for the :hover rule
  const hoverClass = `btn-${colorScheme}-${variant}`;
  const hoverCSS =
    variant === "solid"
      ? `.${hoverClass}:not(:disabled):hover { background: ${tokens[colorScheme].solid.hover} !important; }`
      : `.${hoverClass}:not(:disabled):hover { background: ${tokens[colorScheme].outline.hoverBg} !important; }`;

  const spinnerColor = variant === "solid" ? (t as typeof tokens.purple.solid).text : (t as typeof tokens.purple.outline).text;

  return (
    <>
      <style>{hoverCSS}</style>
      <button
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={hoverClass}
        style={{
          ...baseStyle,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: s.gap,
          padding: s.padding,
          fontSize: s.fontSize,
          fontWeight: 600,
          fontFamily: "inherit",
          borderRadius: s.borderRadius,
          cursor: isDisabled ? "not-allowed" : "pointer",
          width: fullWidth ? "100%" : undefined,
          transition: "background 0.15s ease, opacity 0.15s ease",
          userSelect: "none",
          outline: "none",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={spinnerColor as string} />
            {loadingText ?? children}
          </>
        ) : (
          <>
            {leftIcon && <span style={{ display: "flex", alignItems: "center" }}>{leftIcon}</span>}
            {children}
            {rightIcon && <span style={{ display: "flex", alignItems: "center" }}>{rightIcon}</span>}
          </>
        )}
      </button>
    </>
  );
}
