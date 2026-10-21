import type { SVGProps } from "react";

/**
 * Main navbar icons — one per nav item, hover-animated. No stylesheet was
 * supplied with these (same as the collection icon packs), so the hover
 * behavior here is authored from the semantic class names already present
 * in the markup (.h-smoke rising chimney puffs, .cs-d typing dots, .sv-gear
 * spin, .a "accent" elements hidden until hover, etc).
 */

type IconProps = SVGProps<SVGSVGElement>;

const mergeClass = (base: string, extra?: string) => [base, extra].filter(Boolean).join(" ");

export const NavIconStyles = () => (
  <style>{`
svg.ico{width:100%;height:100%;overflow:visible;fill:none;stroke:var(--ic,currentColor);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;--ic:currentColor;--acc:#16a34a}
svg.ico .f{fill:var(--ic,currentColor);fill-opacity:.16}
svg.ico .f2{fill:var(--ic,currentColor);fill-opacity:.26}
svg.ico .thin{stroke-width:1.1}
svg.ico .a{opacity:0}

@keyframes nvsmoke{0%{opacity:0;transform:translateY(0) scale(.6)}30%{opacity:.85}100%{opacity:0;transform:translateY(-3px) scale(1.3)}}
svg.ico .h-smoke{transform-box:fill-box;transform-origin:center}
svg.ico:hover .h-smoke, svg.ico.loop .h-smoke{animation:nvsmoke 1.4s ease-in-out infinite}
svg.ico:hover .h-smoke.s2, svg.ico.loop .h-smoke.s2{animation-delay:.5s}

@keyframes nvpulse{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
svg.ico .ab-dot,svg.ico .fq-dot{transform-box:fill-box;transform-origin:center}
svg.ico:hover .ab-dot, svg.ico.loop .ab-dot,svg.ico:hover .fq-dot, svg.ico.loop .fq-dot{animation:nvpulse 1s ease-in-out infinite}

@keyframes nvspin{to{transform:rotate(360deg)}}
svg.ico .sv-gear{transform-box:fill-box;transform-origin:center}
svg.ico:hover .sv-gear, svg.ico.loop .sv-gear{animation:nvspin 3s linear infinite}
@keyframes nvswing{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
svg.ico .sv-tag{transform-box:fill-box;transform-origin:center}
svg.ico:hover .sv-tag, svg.ico.loop .sv-tag{animation:nvswing 1.6s ease-in-out infinite}

@keyframes nvlift{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.4px)}}
svg.ico .pr-lid{transform-box:fill-box;transform-origin:center}
svg.ico:hover .pr-lid, svg.ico.loop .pr-lid{animation:nvlift 1.2s ease-in-out infinite}
@keyframes nvsparkle{0%,100%{opacity:.3;transform:scale(.7) rotate(0deg)}50%{opacity:1;transform:scale(1.15) rotate(18deg)}}
svg.ico .pr-star,svg.ico .pf-spark{transform-box:fill-box;transform-origin:center}
svg.ico:hover .pr-star, svg.ico.loop .pr-star{animation:nvsparkle 1.3s ease-in-out infinite}
svg.ico:hover .pf-spark, svg.ico.loop .pf-spark{animation:nvsparkle 1.2s ease-in-out infinite .1s}

@keyframes nvbounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
svg.ico .pf-case{transform-box:fill-box;transform-origin:center}
svg.ico:hover .pf-case, svg.ico.loop .pf-case{animation:nvbounce 1s ease-in-out infinite}

@keyframes nvtype{0%,60%,100%{opacity:.5;transform:translateY(0)}30%{opacity:1;transform:translateY(-2px)}}
svg.ico .cs-d{transform-box:fill-box;transform-origin:center}
svg.ico:hover .cs-d, svg.ico.loop .cs-d{animation:nvtype 1.1s ease-in-out infinite}
svg.ico:hover .cs-d.d2, svg.ico.loop .cs-d.d2{animation-delay:.15s}
svg.ico:hover .cs-d.d3, svg.ico.loop .cs-d.d3{animation-delay:.3s}
svg.ico .cs-check{stroke:var(--acc);stroke-dasharray:1;stroke-dashoffset:1}
@keyframes nvdraw{to{stroke-dashoffset:0}}
svg.ico:hover .cs-check, svg.ico.loop .cs-check{animation:nvdraw .5s ease forwards .35s}

@keyframes nvwiggle{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-8deg)}}
svg.ico .fq-q{transform-box:fill-box;transform-origin:50% 85%}
svg.ico:hover .fq-q, svg.ico.loop .fq-q{animation:nvwiggle 1.2s ease-in-out infinite}
`}</style>
);

export const HomeNavIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" aria-hidden="true" className={mergeClass("ico", p.className)}>
    <path className="f" d="M5 10.2 12 4.3l7 5.9v9.3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
    <path className="h-roof" d="M2.8 11.4 12 3.6l9.2 7.8" />
    <path d="M16 6.6V4.2h2.4v4.6" />
    <path className="h-door f2" d="M10 20.5v-4.3a2 2 0 0 1 4 0v4.3z" />
    <circle className="h-smoke" cx="17.2" cy="3.2" r="1" />
    <circle className="h-smoke s2" cx="17.2" cy="3.2" r="1" />
  </svg>
);

export const AboutNavIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" aria-hidden="true" className={mergeClass("ico", p.className)}>
    <circle className="ab-head f" cx="9" cy="9.8" r="3.2" />
    <path className="f" d="M3 21c0-3.6 2.6-6 6-6s6 2.4 6 6z" />
    <path
      className="ab-bub f2"
      d="M15.4 3.2h4.6a1.6 1.6 0 0 1 1.6 1.6v3.6A1.6 1.6 0 0 1 20 10h-2.8l-2 1.9V10a1.6 1.6 0 0 1-1.4-1.6V4.8a1.6 1.6 0 0 1 1.6-1.6z"
    />
    <circle className="ab-dot a" cx="17.7" cy="5.4" r=".7" />
    <path className="thin" d="M17.7 7v1.8" />
  </svg>
);

export const ServicesNavIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" aria-hidden="true" className={mergeClass("ico", p.className)}>
    <g className="sv-gear">
      <circle cx="8.6" cy="8.6" r="5.4" strokeWidth="2.4" strokeDasharray="2.1 2.14" strokeLinecap="butt" />
      <circle className="f" cx="8.6" cy="8.6" r="4.3" />
      <circle cx="8.6" cy="8.6" r="1.6" />
    </g>
    <g className="sv-tag">
      <path className="f2" d="M13 14.4 16.5 12l3.5 2.4v6.1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1z" />
      <circle cx="16.5" cy="14" r=".6" />
      <path
        className="thin"
        d="M17.5 17.2c0-.7-.5-1-1-1s-1.1.3-1.1.9c0 1.1 2.2.7 2.2 1.8 0 .6-.5 1-1.1 1s-1.1-.3-1.1-1M16.4 15.4v.7M16.4 20v.7"
      />
    </g>
  </svg>
);

export const ProductsNavIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" aria-hidden="true" className={mergeClass("ico", p.className)}>
    <path className="f" d="M4 10.4 12 14v7.6L4 18z" />
    <path className="f2" d="M20 10.4 12 14v7.6l8-3.6z" />
    <path className="thin" d="M6.4 15.4l2.4 1.1" />
    <g className="pr-lid">
      <path className="f" d="M4 10.4 12 6.8l8 3.6-8 3.6z" />
    </g>
    <polygon
      className="pr-star a"
      points="12,1.8 13,4.1 15.4,4.3 13.6,5.9 14.2,8.2 12,7 9.8,8.2 10.4,5.9 8.6,4.3 11,4.1"
    />
  </svg>
);

export const PortfolioNavIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" aria-hidden="true" className={mergeClass("ico", p.className)}>
    <g className="pf-case">
      <path className="pf-handle" d="M9 7.6V6.4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6.4v1.2" />
      <rect className="f" x="3" y="7.6" width="18" height="12.6" rx="2.2" />
      <path d="M3 12.6c2.6 1.8 5.6 2.7 9 2.7s6.4-.9 9-2.7" />
      <rect className="pf-clasp f2" x="10.3" y="12.9" width="3.4" height="3.4" rx=".8" />
    </g>
    <path className="pf-spark a" d="M20.5 1.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
  </svg>
);

export const ConsultationNavIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" aria-hidden="true" className={mergeClass("ico", p.className)}>
    <path
      className="f2"
      d="M4.5 2.8h10A1.5 1.5 0 0 1 16 4.3v5.9a1.5 1.5 0 0 1-1.5 1.5H8.4L5.2 14.4v-2.7h-.7A1.5 1.5 0 0 1 3 10.2V4.3a1.5 1.5 0 0 1 1.5-1.5z"
    />
    <circle className="cs-d a" cx="6.6" cy="7.2" r=".9" />
    <circle className="cs-d d2 a" cx="9.5" cy="7.2" r=".9" />
    <circle className="cs-d d3 a" cx="12.4" cy="7.2" r=".9" />
    <g className="cs-cal">
      <rect className="f" x="11.5" y="13" width="9.5" height="8.6" rx="1.6" />
      <path d="M11.5 16.2H21M14.4 11.8V14M18.1 11.8V14" />
      <path className="cs-check" d="M13.9 19l1.6 1.5 3-3.1" />
    </g>
  </svg>
);

export const FaqsNavIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" aria-hidden="true" className={mergeClass("ico", p.className)}>
    <circle className="fq-c f" cx="12" cy="12" r="9.2" />
    <path className="fq-q" d="M9.5 9.6a2.6 2.6 0 1 1 3.7 2.3c-.8.4-1.2.9-1.2 1.8" />
    <circle className="fq-dot a" cx="12" cy="16.6" r=".9" />
  </svg>
);

export const navIconComponentMap: Record<string, React.FC<IconProps>> = {
  "/": HomeNavIcon,
  "/about": AboutNavIcon,
  "/pricing": ServicesNavIcon,
  "/collection": ProductsNavIcon,
  "/portfolio": PortfolioNavIcon,
  "/consultation": ConsultationNavIcon,
  "/faqs": FaqsNavIcon,
};
