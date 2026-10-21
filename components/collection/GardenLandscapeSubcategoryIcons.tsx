import type { SVGProps } from "react";

/**
 * Garden & Landscape subcategory icons — converted from the client's SVG
 * set (garden/*.svg), 240x180 viewBox. Pure-black structural fills were
 * retargeted to currentColor for brand theming, and the literal
 * fill/stroke="#3cf224" "knockout" cutouts (matching the demo page's green
 * background — string-light bulbs, a lantern panel, an umbrella rib
 * highlight) were retargeted to the site's cream (#F6F0E4). The water-blue
 * and warm-glow accent colors are literal and left as supplied.
 */

type IconProps = SVGProps<SVGSVGElement>;

const mergeClass = (base: string, extra?: string) => [base, extra].filter(Boolean).join(" ");

export const GardenLandscapeIconStyles = () => (
  <style>{`
svg.gn{width:100%;height:100%;overflow:visible;color:inherit;fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;transition:filter .35s}
svg.gn .bg{fill:currentColor;stroke:none}
svg.gn:hover{filter:drop-shadow(0 0 4px rgba(154,118,64,.3))}

@keyframes gnsway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
svg.gn .sprout,svg.gn .can{transform-box:fill-box;transform-origin:bottom center}
svg.gn:hover .sprout,svg.gn:hover .can{animation:gnsway 2.4s ease-in-out infinite}

@keyframes gnpop{0%{opacity:.4;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}
svg.gn .mo,svg.gn .fl,svg.gn .rs,svg.gn .pc,svg.gn .rf{transform-box:fill-box;transform-origin:center}
svg.gn:hover .mo,svg.gn:hover .fl,svg.gn:hover .rs,svg.gn:hover .pc,svg.gn:hover .rf{animation:gnpop .5s ease-out both}

@keyframes gnfade{to{opacity:1}}
svg.gn:hover .glow,svg.gn:hover .pool,svg.gn:hover .bird{animation:gnfade .5s ease forwards}

@keyframes gnbulb{to{fill:#fff27a}}
svg.gn:hover .b{animation:gnbulb .4s ease forwards}
svg.gn .lan{transition:fill .4s}
svg.gn:hover .lan{fill:#fff27a}

@keyframes gnflow{0%{opacity:0;transform:translateY(-4px)}40%{opacity:1}100%{opacity:0;transform:translateY(10px)}}
svg.gn:hover .wt{animation:gnflow 1.1s ease-in-out infinite}

@keyframes gnswing{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
svg.gn .sw,svg.gn .t{transform-box:fill-box;transform-origin:top center}
svg.gn:hover .sw{animation:gnswing 2.2s ease-in-out infinite}
svg.gn:hover .t{animation:gnswing 2.4s ease-in-out infinite}

@keyframes gntilt{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-3deg)}}
svg.gn .cant,svg.gn .mk{transform-box:fill-box;transform-origin:top center}
svg.gn:hover .cant,svg.gn:hover .mk{animation:gntilt 2.4s ease-in-out infinite}
@keyframes gnspin{to{transform:rotate(45deg)}}
svg.gn .crank{transform-box:fill-box;transform-origin:center}
svg.gn:hover .crank{animation:gnspin 1.2s ease-in-out infinite alternate}

@keyframes gnblade{0%,100%{transform:rotate(0deg)}50%{transform:rotate(4deg)}}
svg.gn .bl{transform-box:fill-box;transform-origin:bottom center}
svg.gn:hover .bl{animation:gnblade 1.4s ease-in-out infinite}

@keyframes gnspiral{to{transform:rotate(360deg)}}
svg.gn:hover .sp{animation:gnspiral 3s linear infinite}
`}</style>
);

export const PlantersPotsIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<g className="sprout"><path d="M60 96V46"></path><path className="lf lfl" d="M60 80Q40 82 34 68Q50 62 60 76"></path><path className="lf lfr" d="M60 70Q78 74 86 60Q70 52 60 66"></path><path className="lf lfl" d="M60 56Q46 54 44 42Q56 40 60 52"></path><path className="lf lfr" d="M60 48Q64 34 76 30Q76 44 62 50"></path><path d="M42 70L52 74M76 62L66 66" strokeWidth="1.8"></path></g>
<rect className="bg" x="18" y="96" width="84" height="14" rx="2"></rect><path className="bg" d="M26 110L94 110L86 165L34 165Z"></path>
<g className="urn"><rect className="bg" x="128" y="26" width="84" height="10" rx="2"></rect><path className="bg" d="M136 36Q138 64 148 82L192 82Q202 64 204 36Z"></path><path d="M142 44H198" strokeWidth="2"></path>
<path className="bg" d="M146 82Q154 102 170 102Q186 102 194 82Z"></path><path d="M148 82Q152 100 156 82" strokeWidth="2"></path><path d="M156 82Q160 100 164 82" strokeWidth="2"></path><path d="M164 82Q168 100 172 82" strokeWidth="2"></path><path d="M172 82Q176 100 180 82" strokeWidth="2"></path><path d="M180 82Q184 100 188 82" strokeWidth="2"></path><path d="M188 82Q192 100 196 82" strokeWidth="2"></path><rect className="bg" x="160" y="102" width="20" height="12"></rect><path className="bg" d="M162 114Q150 130 148 146L192 146Q190 130 178 114Z"></path><rect className="bg" x="140" y="146" width="60" height="7"></rect><rect className="bg" x="136" y="153" width="68" height="12"></rect></g>
  </svg>
);

export const IndoorOutdoorPlantsIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<path d="M60 120L58 96L40 80M60 120L64 90L80 66M60 120L56 100L36 56M60 120L66 104L88 94M62 112L50 60" strokeWidth="2.5"></path>
<g transform="translate(40 80) rotate(-50) scale(0.75)"><g className="mo" style={{animationDelay: "0s"}}><path className="bg" d="M0 0C-22-4-28-34 0-42C28-34 22-4 0 0Z"></path><path d="M0-2V-38M-20-12L-8-15M-24-24L-8-24M-18-34L-7-31M20-12L8-15M24-24L8-24M18-34L7-31" strokeWidth="2.2"></path></g></g><g transform="translate(80 64) rotate(30) scale(0.8)"><g className="mo" style={{animationDelay: "0.1s"}}><path className="bg" d="M0 0C-22-4-28-34 0-42C28-34 22-4 0 0Z"></path><path d="M0-2V-38M-20-12L-8-15M-24-24L-8-24M-18-34L-7-31M20-12L8-15M24-24L8-24M18-34L7-31" strokeWidth="2.2"></path></g></g><g transform="translate(38 56) rotate(-20) scale(0.75)"><g className="mo" style={{animationDelay: "0.2s"}}><path className="bg" d="M0 0C-22-4-28-34 0-42C28-34 22-4 0 0Z"></path><path d="M0-2V-38M-20-12L-8-15M-24-24L-8-24M-18-34L-7-31M20-12L8-15M24-24L8-24M18-34L7-31" strokeWidth="2.2"></path></g></g><g transform="translate(88 96) rotate(70) scale(0.7)"><g className="mo" style={{animationDelay: "0.30000000000000004s"}}><path className="bg" d="M0 0C-22-4-28-34 0-42C28-34 22-4 0 0Z"></path><path d="M0-2V-38M-20-12L-8-15M-24-24L-8-24M-18-34L-7-31M20-12L8-15M24-24L8-24M18-34L7-31" strokeWidth="2.2"></path></g></g><g transform="translate(52 58) rotate(5) scale(0.7)"><g className="mo" style={{animationDelay: "0.4s"}}><path className="bg" d="M0 0C-22-4-28-34 0-42C28-34 22-4 0 0Z"></path><path d="M0-2V-38M-20-12L-8-15M-24-24L-8-24M-18-34L-7-31M20-12L8-15M24-24L8-24M18-34L7-31" strokeWidth="2.2"></path></g></g>
<rect className="bg" x="40" y="118" width="44" height="10" rx="2"></rect><path className="bg" d="M44 128L80 128L76 165L48 165Z"></path>
<path d="M162 140V100M162 112L150 94M162 106L176 90" strokeWidth="3"></path>
<g className="can"><path className="bg" d="M196.0 60.0A6.6 6.6 0 0 1 191.2 76.0A6.6 6.6 0 0 1 178.0 87.7A6.6 6.6 0 0 1 160.0 92.0A6.6 6.6 0 0 1 142.0 87.7A6.6 6.6 0 0 1 128.8 76.0A6.6 6.6 0 0 1 124.0 60.0A6.6 6.6 0 0 1 128.8 44.0A6.6 6.6 0 0 1 142.0 32.3A6.6 6.6 0 0 1 160.0 28.0A6.6 6.6 0 0 1 178.0 32.3A6.6 6.6 0 0 1 191.2 44.0A6.6 6.6 0 0 1 196.0 60.0Z"></path><path d="M146 52a5 5 0 0 1 8 2M168 44a5 5 0 0 1 8 2M150 72a5 5 0 0 1 8 2M172 66a5 5 0 0 1 8 2M160 60a4 4 0 0 1 6 1" strokeWidth="2"></path></g>
<path className="bg" d="M190 165L182.0 150.0A7.1 7.1 0 0 1 184.0 140.1A7.1 7.1 0 0 1 189.6 131.6A7.1 7.1 0 0 1 198.1 126.0A7.1 7.1 0 0 1 208.0 124.0A7.1 7.1 0 0 1 217.9 126.0A7.1 7.1 0 0 1 226.4 131.6A7.1 7.1 0 0 1 232.0 140.1A7.1 7.1 0 0 1 234.0 150.0L234 165Z"></path><path d="M198 144a5 5 0 0 1 8 2M214 136a5 5 0 0 1 8 2M210 152a4 4 0 0 1 6 1" strokeWidth="2"></path>
<path d="M126 165V112M144 165V100M176 165V114M126 150Q114 146 112 136Q124 136 126 146M144 150Q156 144 158 134Q146 136 144 146M176 152Q190 150 192 140Q180 140 176 148M118 165Q122 152 132 150M136 165Q140 150 150 154" strokeWidth="2.2"></path>
<g className="fl" style={{animationDelay: "0s"}}><circle className="bg" cx="132.0" cy="108.0" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="127.9" cy="113.7" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="121.1" cy="111.5" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="121.1" cy="104.5" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="127.9" cy="102.3" r="4.5" strokeWidth="2"></circle><circle cx="126" cy="108" r="3" strokeWidth="2" className="bg"></circle></g><g className="fl" style={{animationDelay: "0.15s"}}><circle className="bg" cx="150.0" cy="96.0" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="145.9" cy="101.7" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="139.1" cy="99.5" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="139.1" cy="92.5" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="145.9" cy="90.3" r="4.5" strokeWidth="2"></circle><circle cx="144" cy="96" r="3" strokeWidth="2" className="bg"></circle></g><g className="fl" style={{animationDelay: "0.3s"}}><circle className="bg" cx="182.0" cy="110.0" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="177.9" cy="115.7" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="171.1" cy="113.5" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="171.1" cy="106.5" r="4.5" strokeWidth="2"></circle><circle className="bg" cx="177.9" cy="104.3" r="4.5" strokeWidth="2"></circle><circle cx="176" cy="110" r="3" strokeWidth="2" className="bg"></circle></g><path d="M108 165H236"></path>
  </svg>
);

export const GardenLightingIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs><radialGradient id="gt-gw"><stop offset="0" stopColor="#fff27a"></stop><stop offset="1" stopColor="#fff27a" stopOpacity="0"></stop></radialGradient></defs>
<circle opacity="0" className="glow" cx="40" cy="44" r="26" fill="url(#gt-gw)" stroke="none"></circle>
<g className="str"><path d="M50 42Q140 72 234 28M48 100Q140 118 234 60" strokeWidth="2.5"></path><g className="bulb"><path d="M89.8 51.6V57.6" strokeWidth="2"></path><rect className="bg" x="86.3" y="56.6" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.00s"}} className="b" cx="89.8" cy="68.6" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g><g className="bulb"><path d="M131.8 54.0V60.0" strokeWidth="2"></path><rect className="bg" x="128.3" y="59.0" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.09s"}} className="b" cx="131.8" cy="71.0" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g><g className="bulb"><path d="M174.2 48.6V54.6" strokeWidth="2"></path><rect className="bg" x="170.7" y="53.6" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.18s"}} className="b" cx="174.2" cy="65.6" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g><g className="bulb"><path d="M215.2 36.1V42.1" strokeWidth="2"></path><rect className="bg" x="211.7" y="41.1" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.27s"}} className="b" cx="215.2" cy="53.1" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g><g className="bulb"><path d="M88.6 104.2V110.2" strokeWidth="2"></path><rect className="bg" x="85.1" y="109.2" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.36s"}} className="b" cx="88.6" cy="121.2" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g><g className="bulb"><path d="M131.2 100.8V106.8" strokeWidth="2"></path><rect className="bg" x="127.7" y="105.8" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.45s"}} className="b" cx="131.2" cy="117.8" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g><g className="bulb"><path d="M174.0 89.3V95.3" strokeWidth="2"></path><rect className="bg" x="170.5" y="94.3" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.54s"}} className="b" cx="174.0" cy="106.3" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g><g className="bulb"><path d="M215.2 70.8V76.8" strokeWidth="2"></path><rect className="bg" x="211.7" y="75.8" width="7" height="5" strokeWidth="2"></rect><ellipse style={{animationDelay: "0.63s"}} className="b" cx="215.2" cy="87.8" rx="6.5" ry="8" fill="var(--bg,#F6F0E4)" strokeWidth="2.5"></ellipse></g></g>
<path className="bg" d="M28 14L52 14L60 26L20 26Z"></path><circle cx="40" cy="10" r="3" className="bg"></circle>
<path className="lan bg" d="M26 26L54 26L50 60L30 60Z" fill="var(--bg,#F6F0E4)"></path><path d="M40 26V60M28 42H52" strokeWidth="2"></path><rect className="bg" x="26" y="60" width="28" height="8" rx="2"></rect>
<rect className="bg" x="34" y="68" width="12" height="76"></rect><rect className="bg" x="30" y="138" width="20" height="14" rx="2"></rect><rect className="bg" x="26" y="152" width="28" height="13" rx="2"></rect>
  </svg>
);

export const BenchesSwingsIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<g className="bench"><path d="M16 78Q62 58 110 78" strokeWidth="3.5"></path><path d="M16 84Q62 66 110 84" strokeWidth="2"></path><path d="M24 75.37580113728345V104M31 73.69534117469301V104M38 72.24941052897657V104M45 71.11678736591888V104M52 70.3591800223447V104M59 70.01786497101477V104M66 70.11143796807977V104M73 70.63480090658857V104M80 71.55943957497949V104M87 72.83497718752957V104M94 74.39191904627118V104M101 76.14543879785977V104" strokeWidth="2"></path><path d="M16 74V165M110 74V165" strokeWidth="3.5"></path>
<path d="M8 104L32 104M94 104L120 104" strokeWidth="4"></path><rect className="bg" x="12" y="110" width="102" height="8"></rect><path d="M14 124H112M14 130H112" strokeWidth="2"></path><path d="M22 118V165M104 118V165" strokeWidth="3.5"></path></g>
<path d="M136 22H220" strokeWidth="4"></path><path d="M144 22L126 165M144 22L154 140M214 22L234 165M214 22L204 140" strokeWidth="3"></path>
<g className="sw"><path d="M160 24V92M194 24V92" strokeWidth="2"></path><path d="M156 92H198" strokeWidth="3"></path><path d="M162 92V108M168 92V108M174 92V108M180 92V108M186 92V108M192 92V108" strokeWidth="2"></path><rect className="bg" x="154" y="108" width="46" height="7"></rect><path d="M156 100H152V112M198 100H202V112" strokeWidth="2.5"></path></g>
  </svg>
);

export const OutdoorDecorIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<circle cx="34" cy="8" r="4" strokeWidth="2.5"></circle><path d="M34 12V20" strokeWidth="2"></path><path className="bg" d="M16 30Q34 14 52 30Z"></path><ellipse className="bg" cx="34" cy="30" rx="18" ry="3"></ellipse>
<g className="t t1"><rect className="bg" x="19" y="40" width="6" height="56" strokeWidth="2.5"></rect><path d="M22 33V40" strokeWidth="1.5"></path></g><g className="t t2"><rect className="bg" x="28" y="40" width="6" height="68" strokeWidth="2.5"></rect><path d="M31 33V40" strokeWidth="1.5"></path></g>
<g className="t t3"><rect className="bg" x="37" y="40" width="6" height="64" strokeWidth="2.5"></rect><path d="M40 33V40" strokeWidth="1.5"></path></g><g className="t t4"><rect className="bg" x="46" y="40" width="6" height="50" strokeWidth="2.5"></rect><path d="M49 33V40" strokeWidth="1.5"></path></g>
<g className="t sail"><path d="M34 33V112" strokeWidth="1.5"></path><rect className="bg" x="30" y="76" width="8" height="5" strokeWidth="2"></rect><path className="bg" d="M34 112Q26 124 34 136Q42 124 34 112Z" strokeWidth="2.5"></path></g>
<g className="hat"><path className="bg" d="M120 82Q124 52 146 30Q140 58 156 82Z"></path></g><rect className="bg" x="118" y="80" width="40" height="7" rx="3"></rect>
<path className="bg" d="M122 92Q112 124 120 150L156 150Q164 124 154 92Z"></path><circle className="bg" cx="138" cy="94" r="10"></circle><circle cx="133" cy="92" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="143" cy="92" r="1.6" fill="currentColor" stroke="none"></circle><circle className="bg" cx="138" cy="98" r="3.5" strokeWidth="2"></circle>
<path className="bg" d="M126 100Q124 124 138 132Q152 124 150 100Q144 106 138 104Q132 106 126 100Z" strokeWidth="2.5"></path><path d="M132 110Q138 116 144 110M134 118Q138 122 142 118" strokeWidth="1.6"></path>
<path d="M122 120Q116 128 124 136M154 120Q160 128 152 136M122 140H154" strokeWidth="2.5"></path><ellipse className="bg" cx="129" cy="156" rx="10" ry="5"></ellipse><ellipse className="bg" cx="149" cy="156" rx="10" ry="5"></ellipse><rect className="bg" x="114" y="160" width="50" height="5" rx="2"></rect>
<path d="M210 86V165" strokeWidth="3"></path><rect className="bg" x="192" y="48" width="36" height="40"></rect><path className="bg" d="M184 52L210 26L236 52"></path><path d="M190 48L210 30L230 48" strokeWidth="2"></path><path d="M210 22V26" strokeWidth="2.5"></path>
<circle cx="210" cy="64" r="6.5" fill="currentColor"></circle><g className="bird" opacity="0"><circle cx="210" cy="63" r="6" fill="#ffd84a" strokeWidth="2"></circle><circle cx="212" cy="61" r="1" fill="currentColor" stroke="none"></circle><path d="M215 63l4 1-4 1.5" fill="#f08a1c" strokeWidth="1.5"></path></g><path d="M210 76V82" strokeWidth="2.5"></path><rect className="bg" x="200" y="90" width="20" height="6" rx="2"></rect>
  </svg>
);

export const FountainsWaterIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<rect className="bg" x="40" y="155" width="64" height="10" rx="3"></rect><path className="bg" d="M54 155Q60 132 64 110L80 110Q84 132 90 155Z"></path><path d="M60 140H84M62 126H82" strokeWidth="2"></path>
<path className="bg" d="M14 90L130 90Q124 112 72 116Q20 112 14 90Z"></path><ellipse className="bg" cx="72" cy="90" rx="58" ry="7"></ellipse><ellipse opacity="0" className="pool" cx="72" cy="90" rx="52" ry="4.5" fill="#1b6fd6" stroke="none"></ellipse>
<rect className="bg" x="66" y="62" width="12" height="28"></rect><path className="bg" d="M42 52L102 52Q98 68 72 70Q46 68 42 52Z"></path><ellipse className="bg" cx="72" cy="52" rx="30" ry="5"></ellipse><ellipse opacity="0" className="pool" cx="72" cy="52" rx="25" ry="3" fill="#1b6fd6" stroke="none"></ellipse>
<path className="bg" d="M64 50Q62 40 68 38L76 38Q82 40 80 50Z" strokeWidth="2.5"></path><path d="M72 38V30" strokeWidth="2.5"></path>
<path opacity="0" className="wt" d="M72 30Q62 14 54 30M72 30Q82 14 90 30M72 30V12" strokeWidth="2"></path><path opacity="0" className="wt" d="M44 56Q36 68 30 88M100 56Q108 68 114 88M20 96Q14 112 18 150M124 96Q130 112 126 150" strokeWidth="2"></path>
<rect className="bg" x="176" y="42" width="44" height="100" rx="8"></rect><circle cx="188" cy="58" r="3.5" strokeWidth="2.5"></circle><circle cx="206" cy="56" r="3.5" strokeWidth="2.5"></circle><circle cx="196" cy="72" r="3" strokeWidth="2.5"></circle><circle cx="210" cy="78" r="2.5" strokeWidth="2"></circle>
<path opacity="0" className="wt" d="M188 62V120M206 60V112M196 76V124M210 82V118" strokeWidth="2"></path>
<path className="bg" d="M176 132Q170 96 186 94Q200 96 198 132Z"></path><path className="bg" d="M194 132Q192 108 206 106Q220 108 218 132Z"></path><path d="M184 102Q180 112 182 124" strokeWidth="2"></path>
<rect className="bg" x="148" y="128" width="88" height="37" rx="2"></rect><path d="M148 136L156 128M236 136L228 128M156 136H228" strokeWidth="2.5"></path>
  </svg>
);

export const PergolasTrellisesIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<path d="M20 165V72A50 50 0 0 1 120 72V165M28 165V72A42 42 0 0 1 112 72V165" strokeWidth="3"></path><path d="M29.4 61.1L21.7 59.1M33.6 51.0L26.7 47.0M40.3 42.3L34.6 36.6M49.0 35.6L45.0 28.7M59.1 31.4L57.1 23.7M70.0 30.0L70.0 22.0M80.9 31.4L82.9 23.7M91.0 35.6L95.0 28.7M99.7 42.3L105.4 36.6M106.4 51.0L113.3 47.0M110.6 61.1L118.3 59.1M20 82L28 82M112 82L120 82M20 92L28 92M112 92L120 92M20 102L28 102M112 102L120 102M20 112L28 112M112 112L120 112M20 122L28 122M112 122L120 122M20 132L28 132M112 132L120 132M20 142L28 142M112 142L120 142M20 152L28 152M112 152L120 152M20 162L28 162M112 162L120 162" strokeWidth="2"></path>
<path d="M24 160Q36 130 22 110Q14 90 30 60Q50 30 80 26M116 160Q104 130 118 100Q124 80 110 60" strokeWidth="1.8"></path>
<g className="rs" style={{animationDelay: "0.00s"}}><circle className="bg" cx="30" cy="44" r="8" strokeWidth="2.5"></circle><path d="M30 44m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.08s"}}><circle className="bg" cx="52" cy="28" r="8" strokeWidth="2.5"></circle><path d="M52 28m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.16s"}}><circle className="bg" cx="86" cy="24" r="8" strokeWidth="2.5"></circle><path d="M86 24m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.24s"}}><circle className="bg" cx="108" cy="40" r="8" strokeWidth="2.5"></circle><path d="M108 40m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.32s"}}><circle className="bg" cx="22" cy="88" r="8" strokeWidth="2.5"></circle><path d="M22 88m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.40s"}}><circle className="bg" cx="30" cy="118" r="8" strokeWidth="2.5"></circle><path d="M30 118m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.48s"}}><circle className="bg" cx="20" cy="146" r="8" strokeWidth="2.5"></circle><path d="M20 146m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.56s"}}><circle className="bg" cx="116" cy="82" r="8" strokeWidth="2.5"></circle><path d="M116 82m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.64s"}}><circle className="bg" cx="110" cy="112" r="8" strokeWidth="2.5"></circle><path d="M110 112m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g><g className="rs" style={{animationDelay: "0.72s"}}><circle className="bg" cx="120" cy="140" r="8" strokeWidth="2.5"></circle><path d="M120 140m-1 0a1.5 1.5 0 1 1 2.5 1.5a4 4 0 1 1-5-4a6 6 0 1 1 7 7" strokeWidth="1.5"></path></g>
<path d="M38 70q-8-2-10 4q8 2 10-4M100 120q8-2 10 4q-8 2-10-4M18 104q-6 4-4 10q6-4 4-10" strokeWidth="1.8"></path>
<path className="rf bg" d="M144 32L148 22L154 22L156 32" strokeWidth="2.5" style={{animationDelay: "0.00s"}}></path><path className="rf bg" d="M158 32L162 22L168 22L170 32" strokeWidth="2.5" style={{animationDelay: "0.07s"}}></path><path className="rf bg" d="M172 32L176 22L182 22L184 32" strokeWidth="2.5" style={{animationDelay: "0.14s"}}></path><path className="rf bg" d="M186 32L190 22L196 22L198 32" strokeWidth="2.5" style={{animationDelay: "0.21s"}}></path><path className="rf bg" d="M200 32L204 22L210 22L212 32" strokeWidth="2.5" style={{animationDelay: "0.28s"}}></path><path className="rf bg" d="M214 32L218 22L224 22L226 32" strokeWidth="2.5" style={{animationDelay: "0.35s"}}></path><path className="rf bg" d="M228 32L232 22L238 22L240 32" strokeWidth="2.5" style={{animationDelay: "0.42s"}}></path><rect className="bg" x="136" y="32" width="102" height="8"></rect><path d="M140 44H234" strokeWidth="2.5"></path><path d="M162 44V150M214 44V150" strokeWidth="2.5"></path>
<rect className="bg" x="146" y="44" width="8" height="121"></rect><rect className="bg" x="222" y="44" width="8" height="121"></rect><path d="M154 72L180 44M222 72L196 44M154 64L170 44M222 64L206 44" strokeWidth="2.5"></path>
  </svg>
);

export const ArtificialGrassIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs><pattern id="ag-dt" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".9" fill="currentColor"></circle></pattern></defs>
<path className="bl" style={{animationDelay: "0.20s"}} d="M64 102L66.5 90L68.5 98L71 88L73 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.24s"}} d="M73 102L75.5 90L77.5 98L80 88L82 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.28s"}} d="M82 102L84.5 90L86.5 98L89 88L91 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.32s"}} d="M91 102L93.5 90L95.5 98L98 88L100 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.36s"}} d="M100 102L102.5 90L104.5 98L107 88L109 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.40s"}} d="M109 102L111.5 90L113.5 98L116 88L118 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.44s"}} d="M118 102L120.5 90L122.5 98L125 88L127 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.48s"}} d="M127 102L129.5 90L131.5 98L134 88L136 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.52s"}} d="M136 102L138.5 90L140.5 98L143 88L145 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.56s"}} d="M145 102L147.5 90L149.5 98L152 88L154 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.60s"}} d="M154 102L156.5 90L158.5 98L161 88L163 102" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.64s"}} d="M163 102L165.5 90L167.5 98L170 88L172 102" strokeWidth="2"></path><path className="bg" d="M64 102L176 100L176 152L14 152Z"></path><path d="M64 102L176 100L176 152L14 152Z" fill="url(#ag-dt)" strokeWidth="2.5"></path><path className="bl" style={{animationDelay: "0.00s"}} d="M14 152L17 138L19 148L22 136L24 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.04s"}} d="M24 152L27 138L29 148L32 136L34 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.08s"}} d="M34 152L37 138L39 148L42 136L44 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.12s"}} d="M44 152L47 138L49 148L52 136L54 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.16s"}} d="M54 152L57 138L59 148L62 136L64 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.20s"}} d="M64 152L67 138L69 148L72 136L74 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.24s"}} d="M74 152L77 138L79 148L82 136L84 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.28s"}} d="M84 152L87 138L89 148L92 136L94 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.32s"}} d="M94 152L97 138L99 148L102 136L104 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.36s"}} d="M104 152L107 138L109 148L112 136L114 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.40s"}} d="M114 152L117 138L119 148L122 136L124 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.44s"}} d="M124 152L127 138L129 148L132 136L134 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.48s"}} d="M134 152L137 138L139 148L142 136L144 152" strokeWidth="2"></path><path className="bl" style={{animationDelay: "0.52s"}} d="M144 152L147 138L149 148L152 136L154 152" strokeWidth="2"></path>
<rect className="bg" x="12" y="152" width="180" height="13" rx="2"></rect><path d="M14 158H190" strokeWidth="1.5" strokeDasharray="2 3"></path>
<g className="roll"><path className="bg" d="M158 130L136 74A32 32 0 0 1 200 62L222 118Z"></path><path d="M158 130L136 74A32 32 0 0 1 200 62L222 118Z" fill="url(#ag-dt)"></path><circle className="bg" cx="190" cy="130" r="33"></circle><path className="sp vb" style={{transformOrigin: "190px 130px"}} d="M190 130L192.0 130.0L192.5 130.8L192.7 131.8L192.4 133.0L191.6 134.2L190.4 135.1L188.7 135.6L186.8 135.5L184.8 134.8L183.1 133.3L181.8 131.2L181.2 128.6L181.4 125.8L182.6 123.0L184.7 120.6L187.6 118.8L191.1 118.0L194.8 118.2L198.5 119.7L201.7 122.3L204.0 125.9L205.2 130.3L205.1 134.9L203.5 139.5L200.4 143.6L196.2 146.6L191.0 148.4L185.4 148.4L179.8 146.8L174.8 143.4L171.0 138.6L168.6 132.7L168.2 126.1L169.7 119.6L173.3 113.6L178.6 108.8L185.2 105.8L192.6 104.8L200.2 106.2L207.2 109.8L213.0 115.4L216.8 122.7L218.4 131.0L217.5 139.5" strokeWidth="2.5"></path></g>
  </svg>
);

export const GardenEdgingIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<g className="rg r1"><path className="bg" d="M12 48L12 66A58 20 0 0 0 128 66L128 48Z"></path><ellipse className="bg" cx="70" cy="48" rx="58" ry="20"></ellipse><ellipse cx="70" cy="48" rx="51" ry="17" strokeWidth="2.5"></ellipse></g><g className="rg r2"><path className="bg" d="M28 44L28 58A42 13 0 0 0 112 58L112 44Z"></path><ellipse className="bg" cx="70" cy="44" rx="42" ry="13"></ellipse><ellipse cx="70" cy="44" rx="35" ry="10" strokeWidth="2.5"></ellipse></g><g className="rg r3"><path className="bg" d="M44 40L44 50A26 8 0 0 0 96 50L96 40Z"></path><ellipse className="bg" cx="70" cy="40" rx="26" ry="8"></ellipse><ellipse cx="70" cy="40" rx="19" ry="5" strokeWidth="2.5"></ellipse></g><g className="pc" style={{animationDelay: "0s"}}><path className="bg" d="M98 165V126Q98 104 120 104Q142 104 142 126V165Z"></path><path d="M104 124Q106 112 120 111Q134 112 136 124" strokeWidth="2"></path></g><g className="pc" style={{animationDelay: "0.12s"}}><path className="bg" d="M142 165V126Q142 104 164 104Q186 104 186 126V165Z"></path><path d="M148 124Q150 112 164 111Q178 112 180 124" strokeWidth="2"></path></g><g className="pc" style={{animationDelay: "0.24s"}}><path className="bg" d="M186 165V126Q186 104 208 104Q230 104 230 126V165Z"></path><path d="M192 124Q194 112 208 111Q222 112 224 124" strokeWidth="2"></path></g>
  </svg>
);

export const OutdoorUmbrellasIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("gn", p.className)}>
    <defs></defs>
<g className="cant"><path className="bg" d="M62 74Q112 26 150 16Q176 30 222 44Q160 50 104 64Z"></path><path d="M150 16L104 64M150 16L160 50M150 16L72 72M150 16L196 46" strokeWidth="2"></path><path d="M104 64Q92 52 62 74M104 64Q132 50 160 50Q180 44 222 44" strokeWidth="2.5"></path><path d="M150 16L150 34" strokeWidth="2"></path>
<path d="M44 80Q48 40 150 14" strokeWidth="5"></path><path d="M44 80Q48 40 150 14" stroke="var(--bg,#F6F0E4)" strokeWidth="1.5"></path><path d="M32 66L44 80" strokeWidth="3"></path></g>
<rect className="bg" x="40" y="72" width="8" height="88"></rect><g className="crank"><circle className="bg" cx="44" cy="110" r="5" strokeWidth="2.5"></circle><path d="M44 110L52 116" strokeWidth="2.5"></path></g><rect className="bg" x="22" y="160" width="46" height="6" rx="2"></rect>
<path d="M178 90V170" strokeWidth="3.5"></path><rect className="bg" x="160" y="168" width="36" height="6" rx="2"></rect>
<g className="mk"><path className="bg" d="M118 122L178 84L238 122"></path><path className="bg" d="M118 122Q128 132 138 122Q148 132 158 122Q168 132 178 122Q188 132 198 122Q208 132 218 122Q228 132 238 122L238 122L178 84Z"></path><path d="M178 84L138 122M178 84L158 124M178 84L198 124M178 84L218 122M178 84V124" strokeWidth="2"></path><path d="M178 84V76" strokeWidth="3"></path><circle className="bg" cx="178" cy="74" r="3" strokeWidth="2"></circle></g>
  </svg>
);

export const gardenLandscapeSubcategoryIconMap: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  "Planters and pots": PlantersPotsIcon,
  "Indoor and outdoor plants": IndoorOutdoorPlantsIcon,
  "Garden lighting": GardenLightingIcon,
  "Garden benches and swings": BenchesSwingsIcon,
  "Outdoor décor": OutdoorDecorIcon,
  "Fountains and water features": FountainsWaterIcon,
  "Pergolas and trellises": PergolasTrellisesIcon,
  "Artificial grass": ArtificialGrassIcon,
  "Garden edging": GardenEdgingIcon,
  "Outdoor umbrellas": OutdoorUmbrellasIcon,
};
