import type { ReactNode } from "react";

interface SectionLabelProps {
  id: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SectionLabel({
  id,
  children,
  icon,
  className = "",
}: SectionLabelProps) {
  return (
    <h2
      id={id}
      className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ink ${className}`}
    >
      {icon}
      {children}
    </h2>
  );
}
