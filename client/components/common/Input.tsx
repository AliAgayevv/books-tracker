"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Info } from "lucide-react";

const eyeAnimStyles = `
  @keyframes eye-close {
    from { transform: scaleY(1); opacity: 1; }
    to   { transform: scaleY(0); opacity: 0.3; }
  }
  @keyframes eye-open {
    from { transform: scaleY(0); opacity: 0.3; }
    to   { transform: scaleY(1); opacity: 1; }
  }
  .eye-closing { animation: eye-close 0.12s ease-in forwards; }
  .eye-opening { animation: eye-open  0.14s ease-out forwards; }
`;

type InputState = "default" | "hover" | "error" | "success";

interface InputProps {
  placeholder?: string;
  supportText?: string;
  state?: InputState;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  label?: string;
}

const stateStyles: Record<InputState, { border: string; bg: string; supportColor: string }> = {
  default: {
    border: "1.5px solid transparent",
    bg: "#F9F9F9",
    supportColor: "#6B7280",
  },
  hover: {
    border: "1.5px solid #7C3AED",
    bg: "#F9F9F9",
    supportColor: "#6B7280",
  },
  error: {
    border: "1.5px solid #DC2626",
    bg: "#FFF5F5",
    supportColor: "#DC2626",
  },
  success: {
    border: "1.5px solid #16A34A",
    bg: "#F0FFF4",
    supportColor: "#16A34A",
  },
};

export function Input({
  placeholder = "Placeholder",
  supportText,
  state = "default",
  value,
  label,
  onChange,
  name,
  id,
  disabled,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [eyeAnim, setEyeAnim] = useState<"idle" | "closing" | "opening">("idle");
  const [internalHover, setInternalHover] = useState(false);

  const handleEyeToggle = () => {
    if (eyeAnim !== "idle") return;
    setEyeAnim("closing");
  };

  const handleAnimationEnd = () => {
    if (eyeAnim === "closing") {
      setIsPasswordVisible((v) => !v);
      setEyeAnim("opening");
    } else if (eyeAnim === "opening") {
      setEyeAnim("idle");
    }
  };

  const resolvedState = state === "default" && internalHover ? "hover" : state;
  const styles = stateStyles[resolvedState];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <style>{eyeAnimStyles}</style>
      {/* Input wrapper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          borderRadius: "12px",
          background: styles.bg,
          border: styles.border,
          transition: "border 0.15s ease, background 0.15s ease",
          cursor: disabled ? "not-allowed" : "text",
          opacity: disabled ? 0.5 : 1,
        }}
        onMouseEnter={() => state === "default" && setInternalHover(true)}
        onMouseLeave={() => setInternalHover(false)}
      >
        {/* Left icon */}
        <Lock size={18} color="#374151" strokeWidth={1.8} />

        {/* Input */}
        <input
          aria-label={label || placeholder}
          id={id}
          name={name}
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "16px",
            color: "#111827",
            fontFamily: "inherit",
          }}
        />

        <button
          type="button"
          onClick={handleEyeToggle}
          disabled={disabled}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            color: "#374151",
          }}
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        >
          <span
            className={
              eyeAnim === "closing"
                ? "eye-closing"
                : eyeAnim === "opening"
                  ? "eye-opening"
                  : undefined
            }
            style={{ display: "flex", alignItems: "center", transformOrigin: "center" }}
            onAnimationEnd={handleAnimationEnd}
          >
            {isPasswordVisible ? (
              <EyeOff size={18} strokeWidth={1.8} />
            ) : (
              <Eye size={18} strokeWidth={1.8} />
            )}
          </span>
        </button>
      </div>

      {supportText && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: styles.supportColor,
            fontSize: "13px",
            transition: "color 0.15s ease",
          }}
        >
          <Info size={13} strokeWidth={1.8} />
          <span>{supportText}</span>
        </div>
      )}
    </div>
  );
}

export { Input as default };
