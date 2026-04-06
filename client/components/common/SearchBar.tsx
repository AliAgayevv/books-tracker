"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { SearchType } from "../../lib/api/books";

const SEARCH_TYPES: { value: SearchType; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "isbn", label: "ISBN" },
];

interface SearchBarProps {
  onSearch: (q: string, type: SearchType) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<SearchType>("title");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    onSearch(trimmed, type);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Type selector */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value as SearchType)}
        disabled={isLoading}
        style={{
          padding: "12px 14px",
          borderRadius: "12px",
          border: "1.5px solid transparent",
          background: "#F9F9F9",
          fontSize: "15px",
          fontFamily: "inherit",
          color: "#111827",
          cursor: isLoading ? "not-allowed" : "pointer",
          outline: "none",
          flexShrink: 0,
        }}
      >
        {SEARCH_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Text input */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          borderRadius: "12px",
          background: "#F9F9F9",
          border: "1.5px solid transparent",
          transition: "border 0.15s ease",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.border = "1.5px solid #7C3AED")
        }
        onBlur={(e) =>
          (e.currentTarget.style.border = "1.5px solid transparent")
        }
      >
        <Search size={18} color="#374151" strokeWidth={1.8} />
        <input
          type="text"
          placeholder={
            type === "isbn"
              ? "Enter ISBN…"
              : type === "author"
                ? "Author name…"
                : "Book title…"
          }
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={isLoading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "15px",
            color: "#111827",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || q.trim().length < 2}
        style={{
          padding: "12px 22px",
          borderRadius: "12px",
          border: "none",
          background:
            isLoading || q.trim().length < 2 ? "#C49AFF" : "#8D43FF",
          color: "#FFFFFF",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor:
            isLoading || q.trim().length < 2 ? "not-allowed" : "pointer",
          transition: "background 0.15s ease",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!isLoading && q.trim().length >= 2)
            (e.currentTarget as HTMLButtonElement).style.background =
              "#7A35EB";
        }}
        onMouseLeave={(e) => {
          if (!isLoading && q.trim().length >= 2)
            (e.currentTarget as HTMLButtonElement).style.background =
              "#8D43FF";
        }}
      >
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
