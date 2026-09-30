"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck } from "lucide-react";
import type { PricingPolicyPoint } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface PaymentPolicyProps {
  policyPoints: PricingPolicyPoint[];
}

export const PaymentPolicy: React.FC<PaymentPolicyProps> = ({ policyPoints }) => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal='up']").forEach((el) =>
          gsap.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 68%", scrub: 0.6 } }));
        gsap.fromTo("[data-reveal='line']", { scaleX: 0 }, { scaleX: 1, ease: "none", transformOrigin: "left center",
          scrollTrigger: { trigger: "[data-reveal='line']", start: "top bottom", end: "top 60%", scrub: 0.6 } });
        gsap.utils.toArray<HTMLElement>("[data-reveal='wipe']").forEach((el, i) =>
          gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)", y: 24, opacity: 0.3 }, {
            clipPath: "inset(0 0% 0 0)", y: 0, opacity: 1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: `top+=${(i % 4) * 60} bottom`, end: "top 65%", scrub: 0.6 },
          }));
      });
    }, root);
    return () => { ctx.revert(); mm.revert(); };
  }, []);

  return (
    <section id="payment-policy" ref={root} className="relative scroll-mt-24 bg-cream pb-[clamp(8px,1.5vw,20px)] pt-[clamp(48px,6vw,88px)] font-instrument text-ink">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,72px)]">
        <div data-reveal="up" className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="flex min-w-0 flex-col gap-3.5">
            <span className="text-[13px] font-semibold uppercase tracking-[.14em] text-gold-deep">Standardised terms</span>
            <h2 className="font-newsreader text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.02] tracking-[-.025em] text-balance">Studio payment and revision policy</h2>
          </div>
          <span className="pb-2 text-[15px] text-[#4A4236]">Applies to all online architectural packages</span>
        </div>

        <div data-reveal="line" className="mt-[clamp(22px,3vw,36px)] h-px bg-gold-line" />

        <div className="mt-[clamp(22px,3vw,36px)] grid grid-cols-1 gap-[clamp(14px,1.6vw,22px)] sm:grid-cols-2 lg:grid-cols-4">
          {policyPoints.map((pt) => (
            <div key={pt.title} data-reveal="wipe" className="grid">
              <article className="flex flex-col gap-3 rounded-[18px] border border-gold/25 bg-[#FFFDF8] p-[clamp(22px,2.2vw,30px)] transition duration-300 hover:-translate-y-[3px] hover:border-gold-line hover:shadow-[0_24px_48px_-28px_rgba(122,91,44,.45)]">
                <h3 className="font-newsreader text-[clamp(21px,1.7vw,24px)] font-medium leading-tight tracking-[-.01em]">{pt.title}</h3>
                <p className="leading-relaxed text-[#4A4236] text-pretty">{pt.description}</p>
              </article>
            </div>
          ))}
        </div>

        <div data-reveal="up" className="mt-[clamp(20px,2.6vw,32px)] flex flex-wrap items-center justify-between gap-x-8 gap-y-3.5 border-t border-gold/25 pt-[18px]">
          <p className="flex max-w-[760px] items-start gap-3 text-[15px] leading-normal text-[#4A4236]">
            <ShieldCheck size={20} strokeWidth={1.8} className="mt-px flex-none text-gold" />
            <span>Official payment gateway: <strong className="font-semibold text-ink">Safepay</strong> (Visa, Mastercard, PayPak, direct bank wire &amp; digital mobile accounts).</span>
          </p>
          <span className="text-[13px] font-semibold uppercase tracking-[.12em] text-gold-deep">100% encrypted · PCI-DSS compliant</span>
        </div>
      </div>
    </section>
  );
};

export default PaymentPolicy;
