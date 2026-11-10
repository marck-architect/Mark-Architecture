import type { LinkItem } from "./profile.config";
import { readIcon } from "./cardIcons";
import { AnimatedIcon } from "./AnimatedIcon";
import { ShareButton } from "./ShareButton";

export function LinkRow({ item }: { item: LinkItem }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-ink/15 bg-white px-3 py-2 shadow-card transition duration-200 hover:scale-[0.98] hover:bg-gold-light/20">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-grow items-center gap-4"
      >
        <AnimatedIcon svg={readIcon(item.icon)} className="size-11" />
        <span className="block truncate text-sm text-ink">{item.label}</span>
      </a>
      <ShareButton label={item.label} url={item.href} />
    </div>
  );
}
