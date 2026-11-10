import Image from "next/image";
import { profile } from "./profile.config";
import { ActionButtons } from "./ActionButtons";

export function ProfileHeader() {
  return (
    <header className="relative h-[230px] w-full overflow-hidden rounded-b-xl bg-ink sm:rounded-xl lg:h-full lg:min-h-[410px] lg:rounded-2xl">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgb(201_168_110/0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgb(201_168_110/0.10)_1px,transparent_1px)] bg-[size:2rem_2rem]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(201_168_110/0.18),transparent_60%)]"
      />
      <Image
        src={profile.images.logoWhite}
        alt={`${profile.company} logo`}
        width={897}
        height={254}
        sizes="(min-width: 1024px) 208px, 176px"
        priority
        className="absolute left-1/2 top-6 h-auto w-44 -translate-x-1/2 lg:top-10 lg:w-52"
      />

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-12 gap-3 p-2 lg:flex lg:flex-col lg:items-start lg:gap-4 lg:p-4">
        <div className="col-span-3 self-end lg:w-24 lg:self-start">
          <div className="aspect-square overflow-hidden rounded-3xl border-2 border-gold bg-white shadow-[0_0_0_3px_rgb(201_168_110/0.25)]">
            <Image
              src={profile.images.avatar}
              alt={profile.name}
              width={200}
              height={200}
              sizes="(min-width: 1024px) 96px, 100px"
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="bg-glass col-span-9 rounded-2xl border border-white/30 p-3 text-white lg:w-full lg:p-4">
          <h1 className="truncate text-sm font-medium lg:text-lg">{profile.name}</h1>
          <p className="truncate text-xs text-gold-light lg:text-sm">{profile.title}</p>
          <p className="mb-2 truncate text-xs text-white/70 lg:mb-3 lg:text-sm">
            at {profile.company}
          </p>
          <ActionButtons />
        </div>
      </div>
    </header>
  );
}
