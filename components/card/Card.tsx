import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`w-full rounded-lg border border-ink/10 bg-white p-3 shadow-card ${className}`}
      {...props}
    />
  );
}
