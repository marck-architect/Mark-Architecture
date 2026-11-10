import type { Metadata } from "next";
import { profile, links } from "@/components/card/profile.config";
import { BioCard } from "@/components/card/BioCard";
import { FooterCard } from "@/components/card/FooterCard";
import { LinkRow } from "@/components/card/LinkRow";
import { PlatformGrid } from "@/components/card/PlatformGrid";
import { ProfileHeader } from "@/components/card/ProfileHeader";
import { PersonJsonLd } from "@/components/card/PersonJsonLd";
import { ToastProvider } from "@/components/card/Toast";

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.company} Digital Card`,
  description: `${profile.title} at ${profile.company}. ${profile.bio}`,
  openGraph: {
    title: `${profile.name} | ${profile.company}`,
    description: `${profile.title} at ${profile.company}`,
    type: "profile",
    images: [
      {
        url: profile.images.avatar,
        width: 800,
        height: 800,
        alt: `${profile.name} - ${profile.title}`,
      },
    ],
  },
};

export default function CardPage() {
  return (
    <ToastProvider>
      <div className="flex min-h-dvh w-full justify-center bg-white text-ink lg:items-center py-0 lg:py-6">
        <PersonJsonLd />
        <div className="w-full max-w-md overflow-hidden sm:mt-2 lg:mt-0 lg:grid lg:max-w-5xl lg:grid-cols-[380px_minmax(0,1fr)] lg:items-stretch lg:gap-10 lg:overflow-visible lg:px-8 lg:py-12">
          <div className="lg:h-full">
            <ProfileHeader />
          </div>
          <div className="px-3 sm:px-0 lg:flex lg:h-full lg:flex-col lg:justify-between lg:px-0">
            <BioCard />
            <div className="mt-5 space-y-2">
              {links.map((item) => (
                <LinkRow key={item.id} item={item} />
              ))}
            </div>
            <PlatformGrid />
            <FooterCard />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
