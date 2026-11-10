import { credit, profile } from "./profile.config";
import { Card } from "./Card";

export function FooterCard() {
  return (
    <Card className="mb-2 mt-5 text-center">
      <a
        href={profile.website}
        className="inline-flex items-center justify-center rounded-full bg-gold-deep px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-gold-darker"
      >
        Visit {profile.company}
      </a>
      <p className="mt-3 text-[11px] text-ink/70">
        <a
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gold-deep"
        >
          {credit.label}
        </a>
      </p>
    </Card>
  );
}
