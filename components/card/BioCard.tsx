import { profile } from "./profile.config";
import { readIcon } from "./cardIcons";
import { AnimatedIcon } from "./AnimatedIcon";
import { Card } from "./Card";
import { SectionLabel } from "./SectionLabel";

export function BioCard() {
  return (
    <Card aria-labelledby="bio-title" className="mt-5 lg:mt-0">
      <SectionLabel
        id="bio-title"
        className="mb-3"
        icon={<AnimatedIcon svg={readIcon("bio")} className="size-11" />}
      >
        Bio
      </SectionLabel>
      <p className="text-xs leading-relaxed text-ink/60 lg:text-sm">
        {profile.bio}
      </p>
    </Card>
  );
}
