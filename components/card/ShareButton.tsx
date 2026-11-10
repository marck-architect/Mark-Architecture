"use client";

import { Share2 } from "lucide-react";
import { profile } from "./profile.config";
import { useToast } from "./Toast";

interface ShareButtonProps {
  label: string;
  url: string;
}

export function ShareButton({ label, url }: ShareButtonProps) {
  const { notify } = useToast();

  const share = async () => {
    const data = { title: `${label} | ${profile.company}`, url };
    try {
      if (typeof navigator.share === "function" && navigator.canShare?.(data) !== false) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      notify("Link copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      notify("Couldn’t share. Please copy the link manually.");
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={`Share ${label}`}
      className="grid size-8 shrink-0 place-items-center rounded-md text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink cursor-pointer"
    >
      <Share2 className="size-4" aria-hidden="true" />
    </button>
  );
}
