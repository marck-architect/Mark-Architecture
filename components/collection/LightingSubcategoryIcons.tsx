import type { CSSProperties, SVGProps } from "react";

/**
 * Lighting subcategory icons — converted from the client's hand-built SVG
 * set (lighting-icons/svg/*.svg). Each one has a built-in hover animation
 * (glow + swing/flicker) via the shared `.ic` CSS below, which only runs
 * when the SVG markup is inlined (not loaded via <img src> or next/image).
 */

type IconProps = SVGProps<SVGSVGElement>;
type VarStyle = CSSProperties & Record<`--${string}`, string | number>;

const varStyle = (vars: Record<string, string | number>): CSSProperties =>
  vars as VarStyle;

// Shared once for every icon on the page — avoids repeating identical CSS
// per instance. Safe to render multiple times; scoped entirely by class name.
export const LightingIconStyles = () => (
  <style>{`
svg.ic{width:100%;height:100%;overflow:visible;color:inherit;--g:var(--glow,#9A7640);transition:filter .35s}
svg.ic *{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
svg.ic .dot{fill:currentColor;stroke:none}
svg.ic .lit{fill:var(--g);stroke:none;opacity:0;transition:opacity .35s}
svg.ic .sh{fill:var(--g);fill-opacity:0;transition:fill-opacity .35s}
svg.ic .swing{transform-origin:60px 6px}
svg.ic:hover{filter:drop-shadow(0 0 7px var(--g))}
svg.ic:hover .lit{opacity:var(--o,.55)}
svg.ic:hover .sh{fill-opacity:.6}
svg.ic:hover .swing{animation:icsw 2.4s ease-in-out infinite}
svg.ic:hover .fl{fill:var(--g);fill-opacity:1;transform-origin:60px 70px;animation:icfk .8s ease-in-out infinite}
svg.ic:hover .wf{animation:icwf 1.2s ease-in-out infinite}
@keyframes icsw{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes icfk{50%{transform:scale(1.12,.94)}}
@keyframes icwf{0%,100%{opacity:.2}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){svg.ic *{animation:none!important}}
`}</style>
);

export const PendantLightIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <g className="swing">
      <path d="M60 6v31" />
      <path d="M52 47V37h16v10" />
      <path className="sh" d="M20 80a40 34 0 0 1 80 0z" />
      <path d="M32 70a28 22 0 0 1 12-12" />
      <path className="lit" style={varStyle({ "--o": 1 })} d="M48 80c0 8 5 12 12 12s12-4 12-12z" />
      <path d="M48 80c0 8 5 12 12 12s12-4 12-12" />
      <path className="lit" style={varStyle({ "--o": 0.25 })} d="M46 96L18 118h84L74 96z" />
    </g>
  </svg>
);

export const ChandelierIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <g className="swing">
      <path d="M48 6h24c0 5-5 8-12 8s-12-3-12-8z" />
      <path d="M60 14v13M60 33v17" />
      <circle cx="60" cy="30" r="3" />
      <path className="sh" d="M52 50h16l4 14H48z" />
      <path className="sh" d="M14 58h16l4 14H10z" />
      <path className="sh" d="M90 58h16l4 14H86z" />
      <path d="M22 72v4c0 12 10 18 20 18 8 0 14-6 18-14 4 8 10 14 18 14 10 0 20-6 20-18v-4" />
      <path d="M60 64v14" />
    </g>
  </svg>
);

export const WallSconceIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <path d="M22 28v48c-12-4-14-44 0-48z" />
    <path className="sh" d="M64 8h26l8 26H56z" />
    <path d="M66 34v9h14v-9" />
    <path d="M26 52c16 4 8 30 26 30 14 0 22-14 22-30v-9" />
    <path className="lit" style={varStyle({ "--o": 0.2 })} d="M56 34L38 84h78L98 34z" />
  </svg>
);

export const TableLampIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <path className="sh" d="M40 8h40l24 28H16z" />
    <path d="M52 44c-12 8-16 22-12 34 2 6 6 8 8 14h24c2-6 6-8 8-14 4-12 0-26-12-34" />
    <path d="M40 92h40v8H40z" />
    <path d="M96 34v14" />
    <circle cx="96" cy="52" r="3" />
    <path className="lit" style={varStyle({ "--o": 0.18 })} d="M16 36L4 100h112L104 36z" />
  </svg>
);

export const FloorLampIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <path className="sh" d="M44 6h32l10 26H34z" />
    <path d="M60 32v72" />
    <path d="M78 32v14" />
    <circle cx="78" cy="50" r="3" />
    <path d="M42 112h36v-5c0-2-3-3-5-3H47c-2 0-5 1-5 3z" />
    <path className="lit" style={varStyle({ "--o": 0.18 })} d="M34 32L10 104h100L86 32z" />
  </svg>
);

export const CeilingLightIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <path d="M48 10h24c0 5-5 8-12 8s-12-3-12-8z" />
    <path d="M60 18v12" />
    <path className="sh" d="M16 42c0-7 5-12 12-12h64c7 0 12 5 12 12v28c0 2-2 4-4 4H20c-2 0-4-2-4-4z" />
    <path className="lit" style={varStyle({ "--o": 1 })} d="M48 74c0 8 5 12 12 12s12-4 12-12z" />
    <path d="M48 74c0 8 5 12 12 12s12-4 12-12" />
    <path className="lit" style={varStyle({ "--o": 0.25 })} d="M48 88L20 116h80L72 88z" />
  </svg>
);

export const TrackLightsIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <path d="M6 30h108" />
    {[26, 60, 94].map((x) => (
      <g key={x} transform={`translate(${x} 58)`}>
        <path d="M0-28v10" />
        <g transform="rotate(40)">
          <path className="lit" style={varStyle({ "--o": 0.45 })} d="M-9 16L-18 44H18L9 16z" />
          <rect className="sh" x="-9" y="-14" width="18" height="30" rx="4" />
          <path d="M-9 8h18" />
        </g>
      </g>
    ))}
  </svg>
);

export const OutdoorLightIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <g className="swing">
      <circle cx="60" cy="9" r="4" />
      <path d="M60 13v5" />
      <path d="M36 36c0-10 10-18 24-18s24 8 24 18z" />
      <path d="M28 36h64v8H28z" />
      <path className="lit" style={varStyle({ "--o": 0.35 })} d="M36 44h48l-2 50H38z" />
      <path d="M36 44l-2 50M84 44l2 50" />
      <path d="M28 94h64v8H28z" />
      <path d="M34 102l-2 8h56l-2-8" />
      <path d="M54 78h12v16H54z" />
      <path className="fl" d="M60 58c-6 8-6 14 0 14s6-6 0-14z" />
    </g>
  </svg>
);

export const GardenLightIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <path d="M44 8h32l6 8H38z" />
    <path className="sh" d="M42 16h36l-4 30H46z" />
    <path d="M54 16l1 30M66 16l-1 30" />
    <path d="M46 46h28v7H46z" />
    <path d="M52 53l8 60 8-60" />
    <path className="lit" style={varStyle({ "--o": 0.3 })} d="M20 108a40 8 0 0 0 80 0a40 8 0 0 0-80 0z" />
  </svg>
);

export const SmartLightingIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 120 120" className={["ic", p.className].filter(Boolean).join(" ")}>
    <path
      className="sh"
      d="M60 8c-18 0-32 14-32 32 0 12 6 20 12 28 3 4 4 7 4 12h32c0-5 1-8 4-12 6-8 12-16 12-28 0-18-14-32-32-32z"
    />
    <path d="M46 90h28M46 98h28M52 106h16" />
    <circle className="dot" cx="60" cy="48" r="3" />
    <path className="wf" d="M53 42a9 9 0 0 1 14 0" />
    <path className="wf" style={{ animationDelay: ".25s" }} d="M47 35a18 18 0 0 1 26 0" />
  </svg>
);

export const lightingSubcategoryIconMap: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  "Pendant lights": PendantLightIcon,
  Chandeliers: ChandelierIcon,
  "Wall lights and sconces": WallSconceIcon,
  "Table lamps": TableLampIcon,
  "Floor lamps": FloorLampIcon,
  "Ceiling lights": CeilingLightIcon,
  "Track lights and spotlights": TrackLightsIcon,
  "Outdoor lights": OutdoorLightIcon,
  "Garden lights": GardenLightIcon,
  "Smart lighting": SmartLightingIcon,
};
