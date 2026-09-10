'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MapPin, Lightbulb, Users, ShieldCheck, Smile } from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Fullscreen Parallax Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full relative transition-transform duration-[12s] scale-105"
            style={{
              transform: `translateY(${scrollY * 0.16}px) scale(1.05)`,
            }}
          >
            <Image
              fill
              priority
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbFjeCx7zKrtZdQ72tcNLVmphH8CwjUvRCA48s1Xry0McJ_Choy9QUYYnI5HNfYxa3TWSAOXJgOkcmspEHon-SkD56zgeuCoGvaVyPIuVts1wsyGRR86o7UiMV6z9qMDCIvG_ADxWjLKWWSlg6h9mnyUc0llDL-rxEk4PzRQ-TkQ1-jWYfSa2L9pewQXHH1yKbBz6EwJkCByK0gibnFXRAWeshbLcMuVEqv3rjINjsDyag0R5z4ywAOlEzqbbGnOGrDGiBVl3mtgkQ"
              alt="MARK Architects Office Building"
              className="object-cover brightness-[0.55]"
              sizes="100vw"
            />
          </div>
        </div>

        {/* Massive Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none overflow-hidden">
          <span className="hero-text-outline font-montserrat text-[22vw] font-extrabold opacity-[0.07] tracking-tighter">
            MARK
          </span>
        </div>

        <div className="relative z-20 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop text-white pt-20">
          <div className="max-w-4xl space-y-6">
            <span className="font-inter text-xs md:text-sm font-bold tracking-[0.35em] text-tertiary-fixed-dim uppercase block">
              Architectural Atelier
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.1] md:leading-[1.15]">
              We Design Spaces <br /> That <span className="italic font-light">Inspire Generations</span>
            </h1>
            <p className="font-inter text-base md:text-xl text-white/80 max-w-xl font-light leading-relaxed">
              Ultra-premium architectural excellence and innovative design thinking tailored for the global elite.
            </p>
            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                href="/portfolio"
                className="bg-tertiary text-on-tertiary px-8 py-4 rounded-xl font-bold tracking-wide hover:bg-tertiary-fixed transition-all duration-300 shadow-lg active:scale-95 text-center"
              >
                View Portfolio
              </Link>
              <Link
                href="/consultation"
                className="border border-white/60 text-white px-8 py-4 rounded-xl font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300 active:scale-95 text-center"
              >
                Book Consultation
              </Link>
            </div>
          </div>

          {/* Floating Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20 md:mt-24">
            <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
              <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">15+</p>
              <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
                Years Experience
              </p>
            </div>
            <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
              <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">200+</p>
              <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
                Masterpieces Completed
              </p>
            </div>
            <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
              <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">150+</p>
              <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
                Private Commissions
              </p>
            </div>
            <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
              <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">24+</p>
              <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
                Global Awards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section (Philosophy) */}
      <section id="about-section" className="py-24 md:py-32 px-4 md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <ScrollReveal>
              <div className="relative rounded-3xl md:rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  fill
                  alt="Minimalist staircase design"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 550px"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqSKyI1VuMXpd5V0dv9hoKpU3ii6nRrI88gIqt8lURY80ydEBlqRDEjv6u7tyoUSJGjYc-YCLjxb2mx-hQk4fkPJd9XLasyFqEDSvTe28fArIDe-lvo-uPt9nAZu9gVyvp5bS7yeXgyz8uCLMhpS7LNTXNHedefqB1YprtHy_pWW-ckSHYTPkeX7OcULo4A2gm7K78AtHj_pioAhSc67BIvw0cqk6lB-jHtwDbf7grG0WyN2AgEDn1mOuPO5ByfY-7fR2hJL_dhADt"
                />
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 space-y-8 md:space-y-10">
            <ScrollReveal delay={0.2}>
              <div className="space-y-4">
                <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-[0.3em] block">
                  The Philosophy
                </span>
                <h2 className="font-playfair text-3xl md:text-5xl text-on-surface leading-tight font-normal dark:text-zinc-100">
                  Architecture as a Permanent Legacy
                </h2>
                <p className="font-inter text-base md:text-lg text-on-surface-variant font-light leading-relaxed dark:text-zinc-400">
                  At MARK Architects, we believe that space is more than just a physical constraint—it is a canvas for human experience. Every structural beam and every glass pane is placed with mathematical precision to create an environment that feels both authoritative and ethereal.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                <div className="flex gap-5 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-surface-container dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-tertiary transition-colors duration-300">
                    <Lightbulb className="text-tertiary group-hover:text-on-primary w-6 h-6 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-xl font-bold mb-1 dark:text-zinc-200">Innovation</h4>
                    <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                      Pushing boundaries with cutting-edge materials and adaptive structural designs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-surface-container dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-tertiary transition-colors duration-300">
                    <ShieldCheck className="text-tertiary group-hover:text-on-primary w-6 h-6 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-xl font-bold mb-1 dark:text-zinc-200">Sustainability</h4>
                    <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                      Integrating regenerative energy systems and eco-conscious construction methods.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-surface-container dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-tertiary transition-colors duration-300">
                    <Users className="text-tertiary group-hover:text-on-primary w-6 h-6 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-xl font-bold mb-1 dark:text-zinc-200">Precision</h4>
                    <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                      Mathematical rigor applied to every millimeter of the design process.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Grid (Preview) */}
      <section className="bg-surface-container-low dark:bg-zinc-900/40 py-24 px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <ScrollReveal>
              <div className="space-y-3">
                <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-[0.3em] block">
                  Curation
                </span>
                <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
                  Selected Works
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <Link
                href="/portfolio"
                className="font-inter text-xs font-bold text-primary dark:text-zinc-300 tracking-widest border-b border-primary dark:border-zinc-300 pb-1.5 hover:text-tertiary hover:border-tertiary transition-colors inline-block"
              >
                VIEW ALL PROJECTS
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <ScrollReveal delay={0.1}>
              <Link href="/portfolio" className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg block">
                <Image
                  fill
                  alt="The Indus Minimalist Villa"
                  className="object-cover transition-transform duration-[0.9s] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                  src="/images/projects/dha_lahore_villa.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-inter text-[10px] font-bold text-tertiary-fixed uppercase tracking-widest mb-1.5 block">
                      RESIDENTIAL
                    </span>
                    <h3 className="font-playfair text-2xl text-white mb-2 font-normal">The Indus Minimalist Villa</h3>
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Lahore, Pakistan</span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Project Card 2 */}
            <ScrollReveal delay={0.2}>
              <Link href="/portfolio" className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg block">
                <Image
                  fill
                  alt="Helix Tech Park"
                  className="object-cover transition-transform duration-[0.9s] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_cLRTKmYAmsa74GtO-7kYhQowruR6rGdaZyJ4dcuKKZKNdos6x-sllZTyvW01uZAU-5v84hvHwuTEnQ-R2FIp7FlqXFuWKm0_OuknA2PJISNEFf_SWkujPsX5leV1DcUDlBOrFkpmDhwtisG4IvcbI4mv4ZFEJmisqNyaypxqfm_m4y7dA__ohFjJN3htn14N79OeFH900A3BAiesRQ-aYOfCHBYYz6TDYSaCW65R4BOiCYVnAmnvM-MqkzcscqlkocpMwj97j28h"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-inter text-[10px] font-bold text-tertiary-fixed uppercase tracking-widest mb-1.5 block">
                      COMMERCIAL
                    </span>
                    <h3 className="font-playfair text-2xl text-white mb-2 font-normal">Helix Tech Park</h3>
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Dubai, UAE</span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Project Card 3 */}
            <ScrollReveal delay={0.3}>
              <Link href="/portfolio" className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg block">
                <Image
                  fill
                  alt="The Zenit Sanctuary"
                  className="object-cover transition-transform duration-[0.9s] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnUHfNGTzdM9nQwp6PSb6b5utCmNYIjsT60KyDtJhTKYypY9v5E9S7VAmcLQ8loFceevPDB7fj2IRZMUN_TBzdoxzczZ7teMUIl5oK5_tgVH-szwHnW0AW_bdcqfEURS1LzzPd8ysvYZFALERFcBkmT3N8lR4Chcyg0USkMoaHluQdvrJVlSHTy119d-oaZGFaq1BYy8FM3O4kUIcxC1vDttKtf_X__Kf_qbAP48sVeS_dfzRfmAPvvrF8xovGiFTE8_gqWEDxjI6V"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-inter text-[10px] font-bold text-tertiary-fixed uppercase tracking-widest mb-1.5 block">
                      HOSPITALITY
                    </span>
                    <h3 className="font-playfair text-2xl text-white mb-2 font-normal">The Zenit Sanctuary</h3>
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Kyoto, Japan</span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <ScrollReveal>
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-[0.3em] block">
              Value Proposition
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Unmatched Architectural Rigor
            </h2>
            <p className="font-inter text-base text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              We bridge the gap between architectural fantasy and structural reality, delivering results that exceed the highest global standards.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay={0.1}>
            <div className="bg-surface dark:bg-zinc-900/50 p-10 rounded-[32px] border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full">
              <Lightbulb className="w-10 h-10 text-tertiary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold mb-3 dark:text-zinc-200">Innovative Design</h3>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Translating bold visions into iconic structural realities through creative engineering.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-surface dark:bg-zinc-900/50 p-10 rounded-[32px] border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full">
              <Users className="w-10 h-10 text-tertiary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold mb-3 dark:text-zinc-200">Experienced Team</h3>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Over 50 world-class designers and engineers working in perfect synchronization.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-surface dark:bg-zinc-900/50 p-10 rounded-[32px] border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full">
              <ShieldCheck className="w-10 h-10 text-tertiary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold mb-3 dark:text-zinc-200">Premium Quality</h3>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Sourcing only the finest materials from a vetted global supply network.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="bg-surface dark:bg-zinc-900/50 p-10 rounded-[32px] border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full">
              <Smile className="w-10 h-10 text-tertiary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold mb-3 dark:text-zinc-200">Bespoke Journeys</h3>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                A specialized experience tailored to the unique lifestyle and goals of our clients.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-inverse-surface dark:bg-zinc-950 py-24 px-4 md:px-margin-desktop overflow-hidden text-white">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] shadow-2xl">
                  <Image
                    fill
                    alt="Alexander Sterling"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    sizes="(max-width: 1024px) 100vw, 450px"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5LKzKTNt76hIVq8W4CVjuYxPo9-N9-ia9m5Cr4IjpxFryo7elYhAS5gg1Fc95_yYf6zSOjY1jKQjkNpR0MgSw2uFCTS2mtsEaY3L678LUzZSo-NxYeV9LFtldOCDdnVw2U61RdeKmeOYOD-mE95joNEY9AkY2Cxy1VQhzTwOHSVFF1tVEGKWstgPGknbkb7FUYE6TdGFFPv_3VVjS1Azg5p8a_vWpxFKy09hMu06EiT6D-0h1JV_3zZCis96XNGtq1cYv6XSe7TI5"
                  />
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 space-y-10">
              <ScrollReveal delay={0.2}>
                <span className="font-playfair text-6xl text-tertiary-fixed opacity-40 block">“</span>
                <blockquote className="font-playfair text-2xl md:text-4xl italic leading-relaxed text-surface-container-lowest font-light">
                  "Working with MARK Architects was a revelation. They didn't just build a home; they captured the essence of my family's legacy and translated it into a physical form that breathes with life, light, and elegance."
                </blockquote>
                <div className="space-y-1 mt-6">
                  <p className="font-playfair text-2xl text-tertiary-fixed font-bold">Alexander Sterling</p>
                  <p className="font-inter text-[10px] font-bold text-white/50 uppercase tracking-[0.25em]">
                    CEO, Sterling Global Developments
                  </p>
                </div>
              </ScrollReveal>

              {/* Partner Logos */}
              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-10 pt-6 opacity-30 grayscale contrast-125 items-center">
                  <div className="relative h-6 w-32">
                    <Image
                      fill
                      alt="Partner Logo 1"
                      className="object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8ytfLm2W-DTFn52VeWTLsoY6sVE2EnxJ-NxpHya03Su7BwS-POdKsN1s8GoO6i44_Jsoq0Hb2LHI76tseayGA6Ss3et__GmclUnKeebO9YcP6EQc7j67SQfoGPYcZ19O0ETfGbIR_bhs5cB8ksuyEjhsHI7PqZJyiCZ2QGPGL7KM8PzdLiV-afVdo-tOGOiq0-ZSbxaSl02n6Ge48nBLMYcv6AxZWXwc20FUAZBt6Zb4urGVApxoP3JpgkoCrhGbJncJr7ZOTyNQV"
                    />
                  </div>
                  <div className="relative h-6 w-32">
                    <Image
                      fill
                      alt="Partner Logo 2"
                      className="object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMAm7_kaF-_-CWyrhIp19YtJI9E2yOLjZVN0mNilKrVnldQVDrkTB0uNBlVDGcOU5kuPHNxhwJmPYJ-fZutc_NWjL61j7TH36VHpF1E_T3xd-iGdz_NagNEYKvCmxuWho3AnJ2kYNAIXcRBXSP-ur66bNBk3bhBv6etqKElV2S4jdJC51CdF68nxJVwe3org9Efh3bjfwERm0qkRwmrAsXh1hrB4yFBaajpYIwmgvzGgYOoBysO_LX_KfqnTPccCVk3UFaFUsKwYik"
                    />
                  </div>
                  <div className="relative h-6 w-32">
                    <Image
                      fill
                      alt="Partner Logo 3"
                      className="object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGauEBGhrOMBB_oLIc1eLLkQvdjPuBZUKj763Lgp2y8XJvyXenA5_dzKZtl8UU75xGEPjnEDtba_MMMZNGXLMTNyQwbTo3CoIaotA_cBWiBMNI3I8NzkOhfN0cM38RqQl2m1RSxKf11lrEP7Z8T42juzyxn_mKvbl8VA-zteIT9QKMVu1Oiv06nNf3jYYk9blg0PrrkOfOoaibC6fUod1puMHSQ0dKIl-ZaHhqRBlGud7Y7buzTKjSGaT2P4HrMdoZH53CZI3y3ENH"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Home */}
      <section className="py-24 px-4 md:px-margin-desktop bg-surface dark:bg-zinc-900 text-center">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Ready to start your journey?
            </h2>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light max-w-xl mx-auto">
              Let's discuss how we can bring your architectural vision to life with precision and passion.
            </p>
            <div className="pt-4">
              <Link
                href="/consultation"
                className="bg-primary text-on-primary hover:bg-tertiary px-12 py-5 rounded-2xl font-playfair text-lg md:text-xl font-bold hover:translate-y-[-3px] transition-all duration-300 shadow-xl active:scale-95 inline-block"
              >
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
