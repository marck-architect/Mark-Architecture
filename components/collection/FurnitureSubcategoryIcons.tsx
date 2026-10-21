import type { SVGProps } from "react";

/**
 * Furniture subcategory icons — converted from the client's hand-built SVG
 * set (furniture-icons/svg/*.svg). Shared CSS (class "fn") drives the hover
 * animation; only runs when the SVG markup is inlined, not via <img src>.
 */

type IconProps = SVGProps<SVGSVGElement>;

const mergeClass = (base: string, extra?: string) => [base, extra].filter(Boolean).join(" ");

// Shared once for every icon on the page — avoids repeating identical CSS
// per instance. Safe to render multiple times; scoped entirely by class name.
export const FurnitureIconStyles = () => (
  <style>{`
svg.fn{width:100%;height:100%;overflow:visible;color:inherit;--g:var(--glow,#9A7640)}
svg.fn *{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
svg.fn .s{fill:currentColor}
svg.fn .tn{fill:currentColor;fill-opacity:.1}
svg.fn .tn2{fill:currentColor;fill-opacity:.2}
svg.fn .tn3{fill:currentColor;fill-opacity:.45}
svg.fn .th{stroke-width:1.8}
svg.fn .mw{fill:#fff;stroke:none}
svg.fn .mb{fill:#000;stroke:none}
svg.fn .mk{fill:none;stroke:#000;stroke-width:2.4}
svg.fn .z{fill:currentColor;stroke:none;font:700 12px system-ui,sans-serif;opacity:0}
svg.fn .ac{fill:var(--g);fill-opacity:0;transition:fill-opacity .3s}
svg.fn .tt{transition:fill .3s}
svg.fn g{transition:transform .5s cubic-bezier(.3,1.5,.5,1),opacity .35s}
svg.fn:hover .ac{fill-opacity:.55}
svg.fn:hover .tt{fill:var(--g)}
svg.fn .fb{transform-box:fill-box}
svg.fn .cu,svg.fn .pl,svg.fn .rk,svg.fn .sway,svg.fn .bk{transform-box:fill-box;transform-origin:50% 100%}
svg.fn:hover .cu{animation:fnsink 1.2s ease-in-out infinite}
svg.fn:hover .cu2{animation-delay:.35s}
svg.fn:hover .pl{transform:scale(1.12)}
svg.fn:hover .bl{transform:translateY(-3px)}
svg.fn:hover .dr{transform:translateX(-7px)}
svg.fn:hover .z{animation:fnzz 1.8s ease-in infinite}
svg.fn:hover .z2{animation-delay:.5s}
svg.fn:hover .z3{animation-delay:1s}
svg.fn:hover .chL{transform:translateX(10px)}
svg.fn:hover .chR{transform:translateX(-10px)}
svg.fn .cup{opacity:0;transform:translateY(-14px)}
svg.fn:hover .cup{opacity:1;transform:none}
svg.fn:hover .steam{animation:fnst 1.4s ease-in-out infinite}
svg.fn:hover .cube{transform:translateY(-4px)}
svg.fn:hover .stool{transform:translateX(-12px)}
svg.fn:hover .rk{transform:rotate(-2deg)}
svg.fn:hover .chair{transform:translateX(9px) rotate(-6deg)}
svg.fn .tx path{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .5s}
svg.fn:hover .tx path{stroke-dashoffset:0}
svg.fn:hover .tx path:nth-child(2){transition-delay:.35s}
svg.fn:hover .tx path:nth-child(3){transition-delay:.7s}
svg.fn:hover .bk{transform:translateY(-7px) rotate(5deg)}
svg.fn:hover .tv{animation:fntv 1.6s ease-in-out infinite}
svg.fn .play{opacity:0}
svg.fn:hover .play{opacity:1}
svg.fn:hover .sway{animation:fnsw 2s ease-in-out infinite}
svg.fn .sun{opacity:0}
svg.fn:hover .sun{opacity:1}
svg.fn:hover .rays{animation:fnsp 6s linear infinite;transform-origin:140px 16px}
@keyframes fnsink{50%{transform:translateY(3px) scaleY(.82)}}
@keyframes fnzz{0%{opacity:0;transform:translateY(8px)}30%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
@keyframes fnst{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-3px);opacity:1}}
@keyframes fntv{0%,100%{fill-opacity:.35}50%{fill-opacity:.8}}
@keyframes fnsw{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes fnsp{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){svg.fn *{animation:none!important}}
`}</style>
);

export const SofaIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <defs>
      <mask id="fsf" maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="140">
        <rect className="mw" x="-10" y="-10" width="180" height="140" />
        <circle className="mk" cx="20" cy="62" r="5" />
        <circle className="mk" cx="140" cy="62" r="5" />
        <path className="mk" d="M30 80h100" />
      </mask>
    </defs>
    <rect x="28" y="20" width="104" height="48" rx="12" />
    <path d="M80 20v40" />
    <g className="pl">
      <path className="th" d="M38 27h34" />
      <circle className="s" cx="55" cy="40" r="2" />
    </g>
    <g className="pl">
      <path className="th" d="M88 27h34" />
      <circle className="s" cx="105" cy="40" r="2" />
    </g>
    <g className="cu">
      <rect className="ac" x="32" y="52" width="46" height="18" rx="7" />
      <path className="th" d="M38 58q17 5 34 0" />
    </g>
    <g className="cu cu2">
      <rect className="ac" x="82" y="52" width="46" height="18" rx="7" />
      <path className="th" d="M88 58q17 5 34 0" />
    </g>
    <g mask="url(#fsf)">
      <circle className="s" cx="20" cy="62" r="11" />
      <circle className="s" cx="140" cy="62" r="11" />
      <rect className="s" x="22" y="70" width="116" height="24" rx="5" />
    </g>
    <path className="s" d="M32 94h8l-1.5 8h-5zM120 94h8l-1.5 8h-5z" />
  </svg>
);

export const BedIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <defs>
      <mask id="fbd" maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="140">
        <rect className="mw" x="-10" y="-10" width="180" height="140" />
        <rect className="mb" x="22" y="26" width="30" height="14" rx="5" />
        <rect className="mb" x="56" y="26" width="30" height="14" rx="5" />
        <path className="mk" d="M18 85h76" />
      </mask>
    </defs>
    <g mask="url(#fbd)">
      <rect className="s" x="12" y="16" width="84" height="34" rx="7" />
      <rect className="s" x="10" y="78" width="92" height="14" rx="3" />
    </g>
    <g className="pl">
      <rect x="22" y="26" width="30" height="14" rx="5" />
      <path className="th" d="M29 33h16" />
    </g>
    <g className="pl">
      <rect x="56" y="26" width="30" height="14" rx="5" />
      <path className="th" d="M63 33h16" />
    </g>
    <g className="bl">
      <path className="ac" d="M16 78V60c0-8 5-12 13-12h54c8 0 13 4 13 12v18z" />
      <path className="th" d="M20 60q36 6 72 0" />
    </g>
    <path className="s" d="M10 92h8v8h-8zM94 92h8v8h-8z" />
    <rect className="s" x="106" y="56" width="42" height="5" rx="2" />
    <rect x="110" y="61" width="34" height="24" />
    <g className="dr">
      <rect x="114" y="65" width="26" height="10" rx="1.5" />
      <circle className="s" cx="127" cy="70" r="1.8" />
    </g>
    <path className="th" d="M110 80h34" />
    <path d="M114 85l-2 12M140 85l2 12" />
    <text className="z" x="102" y="42" fontSize="10">
      z
    </text>
    <text className="z z2" x="112" y="32" fontSize="13">
      z
    </text>
    <text className="z z3" x="124" y="20" fontSize="16">
      z
    </text>
  </svg>
);

export const DiningSetIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <defs>
      <mask id="fdn" maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="140">
        <rect className="mw" x="-10" y="-10" width="180" height="140" />
        <path className="mk" d="M62 28v22M98 28v22" />
      </mask>
    </defs>
    <g className="chL">
      <path d="M14 26l6 38h16M22 64l-3 32M34 64l2 32" />
      <path className="th" d="M15 38l16 2M17 50l16 2" />
    </g>
    <g className="chR">
      <path d="M146 26l-6 38h-16M138 64l3 32M126 64l-2 32" />
      <path className="th" d="M145 38l-16 2M143 50l-16 2" />
    </g>
    <g mask="url(#fdn)">
      <rect className="s" x="52" y="24" width="20" height="30" rx="3" />
      <rect className="s" x="88" y="24" width="20" height="30" rx="3" />
    </g>
    <rect className="s" x="50" y="54" width="24" height="7" rx="2" />
    <rect className="s" x="86" y="54" width="24" height="7" rx="2" />
    <path d="M54 61l-4 34M70 61l4 34M90 61l-4 34M106 61l4 34" />
    <rect className="s tt" x="26" y="50" width="108" height="6" />
    <path d="M32 56v40M128 56v40" />
    <path className="th" d="M34 62h92" />
  </svg>
);

export const CoffeeTableIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <defs>
      <mask id="fct" maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="140">
        <rect className="mw" x="-10" y="-10" width="180" height="140" />
        <path className="mk" d="M24 47q24-5 48 0" />
      </mask>
    </defs>
    <g className="cup">
      <path className="ac" d="M41 28h14v6c0 4-3 6-7 6s-7-2-7-6z" />
      <path d="M55 30h3a3 3 0 0 1 0 6h-3" />
      <g className="steam">
        <path d="M44 23c-2-3 2-4 0-7M52 23c-2-3 2-4 0-7" />
      </g>
    </g>
    <g mask="url(#fct)">
      <ellipse className="s tt" cx="48" cy="50" rx="38" ry="9" />
    </g>
    <path d="M10 52v5c0 6 17 10 38 10s38-4 38-10v-5" />
    <path d="M26 66l-8 26M48 69v25M70 66l8 26" />
    <path className="th" d="M30 80q18 5 36 0" />
    <g className="cube">
      <path className="ac" d="M126 42l22 10-22 10-22-10z" />
      <path d="M104 52v26l22 10 22-10V52M126 62v26" />
      <path className="th" d="M104 78l22-10 22 10" strokeDasharray="3 3" />
    </g>
  </svg>
);

export const ArmchairIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <g className="rk">
      <rect x="34" y="14" width="50" height="46" rx="14" />
      <rect className="th" x="41" y="20" width="36" height="34" rx="9" />
      <circle className="s" cx="52" cy="32" r="1.8" />
      <circle className="s" cx="66" cy="32" r="1.8" />
      <circle className="s" cx="59" cy="42" r="1.8" />
      <rect x="16" y="44" width="20" height="36" rx="10" />
      <rect x="82" y="44" width="20" height="36" rx="10" />
      <path className="th" d="M22 52q-2 12 2 22M96 52q2 12-2 22" />
      <g className="cu">
        <path className="ac" d="M36 62q23-9 46 0v12H36z" />
        <path className="th" d="M41 67q18-5 36 0" />
      </g>
      <path className="s" d="M30 82l-8 18h12zM88 82l8 18h-12z" />
    </g>
    <g className="stool">
      <rect className="s" x="108" y="62" width="38" height="10" rx="5" />
      <path className="th" d="M114 77h26" />
      <path d="M114 72l-6 24M140 72l6 24M112 84h30M110 90h34" />
    </g>
  </svg>
);

export const DeskIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <defs>
      <mask id="fdk" maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="140">
        <rect className="mw" x="-10" y="-10" width="180" height="140" />
        <path className="mk" d="M92 42h18M92 52h18" />
      </mask>
    </defs>
    <rect x="12" y="8" width="54" height="36" rx="3" />
    <rect className="ac" x="16" y="12" width="46" height="28" rx="1" />
    <g className="tx">
      <path pathLength="1" d="M21 19h18" />
      <path pathLength="1" d="M21 25h30" />
      <path pathLength="1" d="M21 31h22" />
    </g>
    <rect className="s" x="37" y="44" width="4" height="6" />
    <rect className="s" x="30" y="50" width="18" height="3" />
    <rect className="s" x="22" y="54" width="28" height="4" rx="1" />
    <rect className="s" x="56" y="53" width="7" height="5" rx="2.5" />
    <g className="chair">
      <rect className="s" mask="url(#fdk)" x="88" y="30" width="26" height="34" rx="11" />
      <rect className="s" x="82" y="68" width="38" height="8" rx="4" />
      <path d="M84 70v-8h-4M118 70v-8h4M101 76v14M86 98l15-8 15 8" />
      <circle cx="86" cy="101" r="3" />
      <circle cx="101" cy="103" r="3" />
      <circle cx="116" cy="101" r="3" />
    </g>
    <rect className="s" x="4" y="58" width="112" height="6" />
    <path d="M10 64v36M110 64v36" />
    <rect x="16" y="66" width="24" height="16" rx="1.5" />
    <path className="th" d="M16 74h24" />
    <circle className="s" cx="28" cy="70" r="1.6" />
    <circle className="s" cx="28" cy="78" r="1.6" />
  </svg>
);

export const ShelfAndTvIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <defs>
      <mask id="fsh" maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="140">
        <rect className="mw" x="-10" y="-10" width="180" height="140" />
        <rect className="mk" x="66" y="80" width="22" height="14" rx="1" />
        <rect className="mk" x="92" y="80" width="20" height="14" rx="1" />
        <rect className="mk" x="116" y="80" width="22" height="14" rx="1" />
        <circle className="mb" cx="84" cy="87" r="1.6" />
        <circle className="mb" cx="96" cy="87" r="1.6" />
        <circle className="mb" cx="120" cy="87" r="1.6" />
      </mask>
    </defs>
    <rect x="8" y="8" width="44" height="92" />
    <path d="M8 38h44M8 68h44" />
    <rect className="s" x="14" y="14" width="4" height="22" />
    <rect className="s" x="20" y="18" width="3" height="18" />
    <rect className="s" x="25" y="12" width="5" height="24" />
    <rect className="s" x="33" y="16" width="4" height="20" />
    <rect className="s" x="14" y="44" width="4" height="22" />
    <rect className="s" x="20" y="48" width="4" height="18" />
    <g className="bk">
      <rect className="s" x="38" y="42" width="4" height="22" />
    </g>
    <rect className="s" x="14" y="74" width="4" height="20" />
    <rect className="s" x="20" y="78" width="3" height="16" />
    <rect x="33" y="80" width="14" height="14" rx="2" />
    <rect x="66" y="26" width="68" height="38" rx="2" />
    <rect className="ac tv" x="70" y="30" width="60" height="30" />
    <path className="s play" d="M94 38l14 7-14 7z" />
    <path d="M100 64v6M90 70h20" />
    <g mask="url(#fsh)">
      <rect className="s" x="62" y="76" width="80" height="24" rx="2" />
    </g>
    <path d="M70 100l-4 8M134 100l4 8" />
  </svg>
);

export const PatioSetIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 160 120" className={mergeClass("fn", p.className)}>
    <defs>
      <mask id="fpt" maskUnits="userSpaceOnUse" x="-10" y="-10" width="180" height="140">
        <rect className="mw" x="-10" y="-10" width="180" height="140" />
        <path className="mk" d="M92 50q20-4 40 0" />
      </mask>
    </defs>
    <g className="sway">
      <path d="M18 12l22-2 4 40-24 2z" />
      <path className="th" d="M19 24l23-2M20 38l23-2" />
      <path d="M22 36h28l3 20M20 56h36M24 56l-3 40M52 56l5 40" />
    </g>
    <g mask="url(#fpt)">
      <ellipse className="s tt" cx="112" cy="50" rx="34" ry="6" />
    </g>
    <path className="th" d="M82 55q30 8 60 0" />
    <path d="M112 56v34M112 90q-4 8-24 10M112 90q4 8 24 10" />
    <g className="sun">
      <circle className="ac" cx="140" cy="16" r="6" />
      <g className="rays">
        <path d="M140 3v4M140 25v4M127 16h4M149 16h4M131 7l3 3M149 7l-3 3M131 25l3-3M149 25l-3-3" />
      </g>
    </g>
  </svg>
);

export const furnitureSubcategoryIconMap: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  "Sofas and lounge seating": SofaIcon,
  "Beds and bedside tables": BedIcon,
  "Dining tables and chairs": DiningSetIcon,
  "Coffee tables and side tables": CoffeeTableIcon,
  "Accent chairs and stools": ArmchairIcon,
  "Desks and office furniture": DeskIcon,
  "Shelving and TV units": ShelfAndTvIcon,
  "Outdoor furniture": PatioSetIcon,
};
