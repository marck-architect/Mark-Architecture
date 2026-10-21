import type { SVGProps } from "react";

/**
 * Home Décor subcategory icons — converted from the client's hand-built SVG
 * set (icons/*.svg). This set ships no built-in hover CSS (unlike the
 * Lighting/Furniture packs), so a small shared stylesheet here fills in solid
 * accent shapes (.k / .bg classes) with currentColor. The var(--bg,#F6F0E4)
 * strokes are a knockout trick (cut a line through a solid shape to match
 * the page's cream background) carried over from the source files verbatim.
 */

type IconProps = SVGProps<SVGSVGElement>;

const mergeClass = (base: string, extra?: string) => [base, extra].filter(Boolean).join(" ");

// Shared once for every icon on the page — avoids repeating identical CSS
// per instance. Safe to render multiple times; scoped entirely by class name.
export const HomeDecorIconStyles = () => (
  <style>{`
svg.dc{width:100%;height:100%;overflow:visible;color:inherit;--g:var(--glow,#9A7640);fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;transition:filter .35s}
svg.dc .k,svg.dc .bg{fill:currentColor;stroke:none}
svg.dc:hover{filter:drop-shadow(0 0 4px var(--g))}
@keyframes dcsway{0%,100%{transform:rotate(0deg)}50%{transform:rotate(3deg)}}
@keyframes dcswing{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes dcspin{to{transform:rotate(360deg)}}
@keyframes dcsweep{0%{transform:translateX(-36px)}100%{transform:translateX(36px)}}
@keyframes dcbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes dcflicker{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.85)}}
@keyframes dctick{0%,88%{transform:rotate(0deg)}100%{transform:rotate(6deg)}}
svg.dc:hover .vase{transform-origin:69px 186px;animation:dcsway 2.2s ease-in-out infinite}
svg.dc:hover .fruit{animation:dcbob 1.8s ease-in-out infinite}
svg.dc:hover .fruit.f2{animation-delay:.3s}
svg.dc:hover .sc{transform-origin:60px 190px;animation:dcsway 2.4s ease-in-out infinite}
svg.dc:hover .ring{transform-origin:100px 100px;animation:dcspin 6s linear infinite}
svg.dc:hover .shine{animation:dcsweep 1.6s ease-in-out infinite alternate}
svg.dc:hover .swing{transform-origin:100px 10px;animation:dcswing 2.2s ease-in-out infinite}
svg.dc:hover .birds{animation:dcbob 1.2s ease-in-out infinite}
svg.dc:hover .small{transform-origin:166px 154px;animation:dcswing 2.6s ease-in-out infinite}
svg.dc:hover .h.mn{transform-origin:100px 100px;animation:dctick 2s steps(1) infinite}
svg.dc:hover .h.hr{transform-origin:100px 100px;animation:dctick 6s steps(1) infinite}
svg.dc:hover .roll{transform-origin:38px 146px;animation:dcspin 3s linear infinite}
svg.dc:hover .p{animation:dcbob 1.8s ease-in-out infinite}
svg.dc:hover .p.p2{animation-delay:.2s}
svg.dc:hover .p.p3{animation-delay:.4s}
svg.dc:hover .flame{transform-origin:66px 77px;animation:dcflicker .5s ease-in-out infinite}
svg.dc:hover .lift{animation:dcbob 1.4s ease-in-out infinite}
svg.dc:hover .fol{transform-origin:100px 140px;animation:dcsway 2.4s ease-in-out infinite}
svg.dc:hover .lv{transform-origin:0px 0px;animation:dcsway 2s ease-in-out infinite}
svg.dc:hover .lv.l1{animation-delay:.2s}
svg.dc:hover .lv.l2{animation-delay:.4s}
`}</style>
);

export const VaseIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
    <g className="vase">
      <ellipse cx="69" cy="22" rx="27" ry="4" />
      <path d="M42 22Q50 30 52 45Q54 60 35 80Q15 105 22 140Q30 175 48 186L92 186Q110 175 116 140Q122 105 102 80Q82 60 84 45Q86 30 96 22" />
      <path d="M34 118Q33 138 40 154" />
    </g>
    <g className="fruit f1">
      <path className="bg" d="M125 112Q112 104 108 118Q106 133 120 135L130 135Q144 133 142 118Q138 104 125 112Z" />
      <path d="M125 112Q126 104 131 100" />
    </g>
    <g className="fruit f2">
      <path className="k" d="M158 108Q142 100 140 118Q140 133 152 135L166 135Q178 132 176 118Q174 100 158 108Z" />
      <path className="k" d="M160 106Q164 92 176 90Q172 104 160 106Z" />
    </g>
    <path className="k" d="M104 134L186 134Q182 158 152 163L138 163Q108 158 104 134Z" />
    <g className="bg" stroke="none">
      <path d="M118 140q6 10 14 13q-4-9-14-13Z" />
      <path d="M145 139q-5 8 0 18q5-10 0-18Z" />
      <path d="M172 140q-6 10-14 13q4-9 14-13Z" />
    </g>
    <rect className="k" x="140" y="162" width="10" height="14" />
    <path className="k" d="M126 187Q145 170 164 187Z" />
  </svg>
);

export const SculptureIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
    <g className="sc">
      <path className="k" d="M48 132Q28 110 42 90Q56 76 74 84Q90 94 86 114Q82 130 66 132Z" />
      <path strokeWidth="10" d="M66 88Q50 68 58 44Q66 18 82 28Q94 40 78 56Q64 70 80 74Q96 78 92 96" />
      <path stroke="var(--bg,#F6F0E4)" strokeWidth="3" d="M52 110Q62 122 78 112" />
    </g>
    <rect className="k" x="22" y="134" width="70" height="56" />
    <path stroke="var(--bg,#F6F0E4)" strokeWidth="2" d="M84 145L84 182" />
    <circle className="halo" cx="145" cy="116" r="16" strokeWidth="2" />
    <circle cx="145" cy="104" r="3.5" className="k" />
    <circle cx="145" cy="116" r="8.5" className="bg" />
    <path className="k" d="M132 128Q126 150 129 172L161 172Q164 150 158 128Q145 122 132 128Z" />
    <path stroke="var(--bg,#F6F0E4)" strokeWidth="2" d="M136 142Q145 150 154 140M134 160Q145 166 156 160" />
    <rect className="k" x="126" y="174" width="38" height="7" />
    <rect className="k" x="120" y="183" width="50" height="7" />
  </svg>
);

export const MirrorIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
    <defs>
      <clipPath id="hd-mirror-shine">
        <circle cx="100" cy="100" r="64" />
      </clipPath>
    </defs>
    <g className="ring">
      <circle cx="100" cy="100" r="90" strokeWidth="5" />
      <circle cx="100" cy="100" r="82" />
      <circle cx="100" cy="100" r="76" />
      <path d="M154.4 45.6L161.5 38.5M45.6 45.6L38.5 38.5M45.6 154.4L38.5 161.5M154.4 154.4L161.5 161.5" />
    </g>
    <circle cx="100" cy="100" r="66" strokeWidth="5" />
    <path d="M56 92L92 56M62 108L108 62M120 150L150 120M136 152L152 136" strokeWidth="2.5" />
    <g clipPath="url(#hd-mirror-shine)">
      <g transform="rotate(45 100 100)">
        <rect className="shine" x="0" y="-60" width="22" height="320" fill="#fff" fillOpacity=".55" stroke="none" />
      </g>
    </g>
  </svg>
);

export const FramesIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
    <g className="swing">
      <path d="M100 10L52 32M100 10L148 32" strokeWidth="2.5" />
      <rect x="28" y="34" width="144" height="150" strokeWidth="10" />
      <rect x="46" y="52" width="108" height="114" />
      <svg x="46" y="52" width="108" height="114" viewBox="46 52 108 114">
        <path d="M47 150L74 106L92 128L120 88L153 140" strokeWidth="2.5" />
        <path d="M80 120l-8 14M86 126l-8 16M118 100l-10 22M124 106l-8 18" strokeWidth="1.5" />
        <path d="M60 78q-2-8 6-8q2-6 9-3q6-1 6 6q5 1 3 5Z" strokeWidth="2" />
        <g className="birds">
          <path d="M110 68q4-4 8 0q4-4 8 0M130 60q3-3 6 0q3-3 6 0" strokeWidth="2" />
        </g>
      </svg>
    </g>
    <circle cx="100" cy="10" r="4.5" className="k" />
    <g className="small">
      <rect className="bg" x="138" y="118" width="56" height="72" strokeWidth="4" />
      <rect x="149" y="129" width="34" height="50" />
      <path d="M138 118L149 129M194 118L183 129M138 190L149 179M194 190L183 179" strokeWidth="2" />
    </g>
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
    <circle cx="100" cy="100" r="92" strokeWidth="7" />
    <path d="M40 30A92 92 0 0 1 96 12" stroke="var(--bg,#F6F0E4)" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="82" strokeWidth="2" />
    <circle cx="100" cy="100" r="76" strokeWidth="5" strokeDasharray="1 6.96" />
    <circle cx="100" cy="100" r="72" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="45" strokeWidth="2" />
    <text x="100.0" y="41.0" transform="rotate(0 100.0 41.0)">XII</text>
    <text x="129.5" y="48.9" transform="rotate(30 129.5 48.9)">I</text>
    <text x="151.1" y="70.5" transform="rotate(60 151.1 70.5)">II</text>
    <text x="159.0" y="100.0" transform="rotate(90 159.0 100.0)">III</text>
    <text x="151.1" y="129.5" transform="rotate(120 151.1 129.5)">IIII</text>
    <text x="129.5" y="151.1" transform="rotate(150 129.5 151.1)">V</text>
    <text x="100.0" y="159.0" transform="rotate(180 100.0 159.0)">VI</text>
    <text x="70.5" y="151.1" transform="rotate(210 70.5 151.1)">VII</text>
    <text x="48.9" y="129.5" transform="rotate(240 48.9 129.5)">VIII</text>
    <text x="41.0" y="100.0" transform="rotate(270 41.0 100.0)">IX</text>
    <text x="48.9" y="70.5" transform="rotate(300 48.9 70.5)">X</text>
    <text x="70.5" y="48.9" transform="rotate(330 70.5 48.9)">XI</text>
    <g className="h hr">
      <path d="M100 100L78 82" strokeWidth="3.5" />
      <path className="k" d="M78 82l-6-9 10 4z" />
    </g>
    <g className="h mn">
      <path d="M100 100L134 68" strokeWidth="3" />
      <path className="k" d="M134 68l3-10-9 6z" />
    </g>
    <path d="M100 100L94 108" strokeWidth="2.5" />
    <circle cx="100" cy="100" r="4" className="bg" strokeWidth="2.5" />
  </svg>
);

export const TextilesIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
    <defs>
      <pattern id="hd-textiles-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0L0 4M0 0L4 0" strokeWidth="1.2" />
      </pattern>
    </defs>
    <path d="M48 176L180 166" strokeWidth="8" strokeDasharray="1.5 3.5" strokeLinecap="butt" />
    <path className="bg" d="M38 121L130 96L182 160L40 170Z" strokeWidth="4" />
    <path d="M52 128L126 108L168 156L54 162Z" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M62 136L120 120L152 152L64 156Z" strokeWidth="1.5" strokeDasharray="1 3" />
    <g className="roll">
      <circle className="bg" cx="38" cy="146" r="25" strokeWidth="4" />
      <path
        d="M38 146m0-4a4 4 0 1 1-4 4a8 8 0 1 1 8 8a12 12 0 1 1-12-12a16 16 0 1 1 16 16"
        strokeWidth="2"
      />
      <circle cx="38" cy="146" r="20.5" strokeWidth="1.5" strokeDasharray="1 3" />
    </g>
    <g className="p p1">
      <path className="k" d="M110 25Q145 31 180 25Q174 65 180 105Q145 99 110 105Q116 65 110 25Z" />
      <path d="M118 34Q145 38 172 34" stroke="var(--bg,#F6F0E4)" strokeWidth="1.5" strokeDasharray="2 3" />
    </g>
    <g className="p p2">
      <path className="bg" d="M148 80Q172 85 196 80Q191 105 196 130Q172 125 148 130Q153 105 148 80Z" />
      <polyline points="155,98 161,92 167,98 173,92 179,98 185,92 190,98" strokeWidth="2" />
      <polyline points="155,112 161,106 167,112 173,106 179,112 185,106 190,112" strokeWidth="2" />
    </g>
    <g className="p p3">
      <path className="bg" d="M104 112Q135 118 166 112Q161 139 166 167Q135 161 104 167Q109 139 104 112Z" />
      <path
        fill="url(#hd-textiles-hatch)"
        stroke="none"
        d="M110 119Q135 124 160 119Q156 139 160 160Q135 155 110 160Q114 139 110 119Z"
      />
    </g>
  </svg>
);

export const TrayIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
    <path
      d="M22 112L16 90Q16 82 25 85L42 98M178 112L184 90Q184 82 175 85L158 98"
      strokeWidth="5"
    />
    <path className="k" d="M12 118A88 32 0 0 0 188 118L188 134A88 32 0 0 1 12 134Z" />
    <ellipse className="bg" cx="100" cy="118" rx="88" ry="32" strokeWidth="4" />
    <ellipse cx="100" cy="120" rx="76" ry="25" strokeWidth="2" />
    <ellipse className="k" cx="66" cy="120" rx="22" ry="7" />
    <path className="bg" d="M51 90L51 116Q66 122 81 116L81 90Z" />
    <ellipse className="bg" cx="66" cy="90" rx="15" ry="4.5" />
    <rect x="56" y="98" width="20" height="12" strokeWidth="2" />
    <path d="M66 89L66 84" strokeWidth="2" />
    <path className="k flame" stroke="none" d="M66 70Q59 79 66 84Q73 79 66 70Z" />
    <ellipse className="bg" cx="134" cy="116" rx="22" ry="7" strokeWidth="2.5" />
    <ellipse className="bg" cx="134" cy="110" rx="22" ry="7" strokeWidth="2.5" />
    <g className="lift">
      <ellipse className="bg" cx="134" cy="104" rx="22" ry="7" strokeWidth="2.5" />
      <ellipse className="bg" cx="134" cy="98" rx="22" ry="7" strokeWidth="2.5" />
      <path d="M134 92L134 106M114 98L154 100M120 94L148 104M148 94L120 104" strokeWidth="1.5" />
    </g>
  </svg>
);

export const PlantIcon = (p: IconProps) => {
  const leaves = [
    { pos: [100, 48], rot: 0, cls: "l0" },
    { pos: [78, 62], rot: -42, cls: "l1" },
    { pos: [122, 62], rot: 42, cls: "l2" },
    { pos: [74, 88], rot: -62, cls: "l0" },
    { pos: [127, 88], rot: 62, cls: "l1" },
    { pos: [80, 114], rot: -52, cls: "l2" },
    { pos: [120, 116], rot: 56, cls: "l0" },
    { pos: [88, 138], rot: -30, cls: "l1" },
    { pos: [113, 140], rot: 32, cls: "l2" },
  ];
  return (
    <svg {...p} viewBox="0 0 200 200" className={mergeClass("dc", p.className)}>
      <g className="fol">
        <path
          d="M100 140L100 42M100 110L84 100M100 112L118 102M100 85L80 76M100 86L122 76"
          strokeWidth="2.5"
        />
        {leaves.map(({ pos: [x, y], rot, cls }, i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <g className={`lv ${cls}`}>
              <path className="k" d="M0 0C-13-6-15-28 0-36C15-28 13-6 0 0Z" />
              <path
                d="M0-2L0-31M0-12l-6-5M0-20l6-5"
                stroke="var(--bg,#F6F0E4)"
                strokeWidth="1.5"
              />
            </g>
          </g>
        ))}
      </g>
      <path d="M70 165L62 196M130 165L138 196M66 182L134 182M100 182L100 196" strokeWidth="3" />
      <path className="bg" d="M65 140L135 140L132 166Q128 184 100 184Q72 184 68 166Z" />
      <ellipse className="bg" cx="100" cy="140" rx="35" ry="5" />
      <path d="M118 148Q122 170 112 182" strokeWidth="2.5" />
    </svg>
  );
};

export const homeDecorSubcategoryIconMap: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  "Vases and decorative bowls": VaseIcon,
  "Sculptures and ornaments": SculptureIcon,
  Mirrors: MirrorIcon,
  "Wall art and frames": FramesIcon,
  Clocks: ClockIcon,
  "Rugs and cushions": TextilesIcon,
  "Decorative trays and accessories": TrayIcon,
  "Artificial plants and indoor planters": PlantIcon,
};
