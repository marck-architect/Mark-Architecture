import type { SVGProps } from "react";

/**
 * Kitchen & Bath subcategory icons — converted from the client's SVG set
 * (fixtures/*.svg). Each source file also baked in a pale-green rounded
 * "card" background rect (a demo.html leftover) which was stripped during
 * extraction to match this site's undecorated icon convention. Structural
 * line/fill colors were retargeted to currentColor for the same brand-gold
 * theming as Lighting/Furniture/Home Décor; the water-blue and LED-glow
 * accent colors are literal and left as supplied.
 */

type IconProps = SVGProps<SVGSVGElement>;

const mergeClass = (base: string, extra?: string) => [base, extra].filter(Boolean).join(" ");

export const KitchenBathIconStyles = () => (
  <style>{`
svg.kb{width:100%;height:100%;overflow:visible;color:inherit;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;transition:filter .35s}
svg.kb .bg{fill:currentColor;stroke:none}
svg.kb:hover{filter:drop-shadow(0 0 4px rgba(154,118,64,.35))}
svg.kb .lev,svg.kb .head,svg.kb .coil,svg.kb .rip,svg.kb .sh,svg.kb .btn,svg.kb .hand,svg.kb .fill,svg.kb .flow{transform-box:fill-box;transform-origin:center}

@keyframes kbbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
svg.kb:hover .soap{animation:kbbob 1.8s ease-in-out infinite}
svg.kb:hover .soap.s2{animation-delay:.3s}
svg.kb:hover .brush{animation:kbbob 1.4s ease-in-out infinite}

@keyframes kbspin{to{transform:rotate(360deg)}}
svg.kb:hover .ring{transform-box:fill-box;transform-origin:center;animation:kbspin 5s linear infinite}

@keyframes kbpress{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
svg.kb:hover .h{animation:kbpress 1.1s ease-in-out infinite}
@keyframes kbshd{0%,100%{transform:scaleX(1);opacity:.12}50%{transform:scaleX(.85);opacity:.22}}
svg.kb:hover .shd{transform-box:fill-box;transform-origin:center;animation:kbshd 1.1s ease-in-out infinite}

@keyframes kbslide{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,3px)}}
svg.kb:hover .d1{animation:kbslide 1.6s ease-in-out infinite}
svg.kb:hover .d2{animation:kbslide 1.6s ease-in-out infinite .2s}

@keyframes kbtilt{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-8deg)}}
svg.kb:hover .lev{animation:kbtilt 1.6s ease-in-out infinite}
@keyframes kbflow{0%{opacity:0;transform:scaleY(.3)}25%{opacity:1}75%{opacity:1}100%{opacity:0;transform:scaleY(1)}}
svg.kb:hover .flow{animation:kbflow 1.3s ease-in-out infinite}
svg.kb:hover .head{animation:kbbob .9s ease-in-out infinite}
@keyframes kbwiggle{0%,100%{transform:rotate(0deg)}50%{transform:rotate(1.5deg)}}
svg.kb:hover .coil{animation:kbwiggle 2s ease-in-out infinite}

@keyframes kbrip{0%,40%{opacity:0;transform:scale(.3)}55%{opacity:.8;transform:scale(.7)}100%{opacity:0;transform:scale(1.8)}}
svg.kb:hover .rip{animation:kbrip 1.3s ease-out infinite}
svg.kb:hover .rip.r2{animation-delay:.2s}
svg.kb:hover .rip.r3{animation-delay:.1s}

@keyframes kbglow{0%{opacity:0}100%{opacity:.8}}
svg.kb:hover .glow{animation:kbglow .6s ease forwards}
@keyframes kbshine{0%{opacity:.15;transform:translate(-4px,-4px)}100%{opacity:.6;transform:translate(4px,4px)}}
svg.kb:hover .sh{animation:kbshine 1.4s ease-in-out infinite alternate}
svg.kb:hover .sh.sh2{animation-delay:.3s}
@keyframes kbpop{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
svg.kb:hover .btn{animation:kbpop 1s ease-in-out infinite}

@keyframes kbdropflow{0%{opacity:0;stroke-dashoffset:22}15%{opacity:1}85%{opacity:1}100%{opacity:0;stroke-dashoffset:0}}
svg.kb:hover .drop{animation:kbdropflow 1s linear infinite}
@keyframes kbsway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
svg.kb:hover .hand{animation:kbsway 2.2s ease-in-out infinite}

@keyframes kbfill{0%{opacity:0;transform:scaleY(.4)}100%{opacity:1;transform:scaleY(1)}}
svg.kb:hover .fill{animation:kbfill .8s ease forwards}
`}</style>
);

export const WashBasinsVanityIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs></defs>

<path className="bg" d="M36 106Q100 90 164 106L164 118Q100 138 36 118Z"></path><path className="bg" d="M40 120Q100 140 160 120L160 166Q100 186 40 166Z"></path><path d="M40 120L40 166M108 140Q128 136 146 129"></path>
<path className="bg" d="M88 80L88 100Q100 106 112 100L112 80"></path>
<path className="bg" d="M42 50Q40 44 50 43L150 43Q160 44 158 50Q152 82 100 86Q48 82 42 50Z"></path><ellipse cx="100" cy="56" rx="40" ry="12"></ellipse>
<ellipse opacity="0" className="fill" cx="100" cy="58" rx="32" ry="8" fill="#3b9ad6" fillOpacity=".35" stroke="none"></ellipse><circle cx="100" cy="61" r="2" fill="currentColor"></circle>
<rect className="bg" x="94" y="28" width="8" height="16" rx="2"></rect><path d="M102 33H108V37"></path><path className="lev vb" d="M98 30L108 22"></path>
<path opacity="0" className="flow w" d="M108 40L108 58" strokeWidth="2.4"></path>
  </svg>
);

export const FaucetsMixersIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs></defs>

<ellipse className="bg" cx="82" cy="166" rx="24" ry="6"></ellipse><path d="M58 166V172Q82 180 106 172V166"></path>
<path className="bg" d="M68 166L70 72Q70 60 82 60L96 60Q104 60 104 70L104 96L148 88Q156 88 156 94L156 104L108 112Q98 116 98 130L98 166"></path>
<path d="M88 166L88 132Q88 112 100 108"></path><path d="M146 106V112L156 110V104"></path><circle cx="96" cy="74" r="3"></circle>
<path d="M62 142L52 144V152L64 150"></path>
<path className="lev bg" d="M70 62Q66 48 78 46L148 40Q155 40 152 47L104 62Z"></path>
<path opacity="0" className="flow w" d="M151 112L151 168" strokeWidth="3"></path>
  </svg>
);

export const ShowersSetsIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs></defs>

<rect className="bg" x="97" y="34" width="6" height="140" rx="3"></rect><path d="M100 34Q100 24 92 26L84 38"></path>
<path className="bg" d="M54 54Q80 34 106 54Z"></path><ellipse className="bg" cx="80" cy="54" rx="26" ry="4.5"></ellipse><circle cx="66" cy="51" r=".9" fill="currentColor" stroke="none"></circle><circle cx="74" cy="49" r=".9" fill="currentColor" stroke="none"></circle><circle cx="82" cy="49" r=".9" fill="currentColor" stroke="none"></circle><circle cx="90" cy="49" r=".9" fill="currentColor" stroke="none"></circle><circle cx="98" cy="51" r=".9" fill="currentColor" stroke="none"></circle><circle cx="70" cy="54" r=".9" fill="currentColor" stroke="none"></circle><circle cx="78" cy="54" r=".9" fill="currentColor" stroke="none"></circle><circle cx="86" cy="54" r=".9" fill="currentColor" stroke="none"></circle><circle cx="94" cy="54" r=".9" fill="currentColor" stroke="none"></circle>
<rect className="bg" x="91" y="64" width="18" height="8" rx="2"></rect><rect className="bg" x="91" y="104" width="18" height="9" rx="2"></rect><rect className="bg" x="90" y="150" width="20" height="8" rx="2"></rect>
<path d="M110 113Q126 140 112 178"></path><path opacity="0" className="drop w" style={{animationDelay: "0s"}} d="M62 62L56.6 104" strokeWidth="2" strokeDasharray="3 8"></path><path opacity="0" className="drop w" style={{animationDelay: "0.07s"}} d="M70 62L67 104" strokeWidth="2" strokeDasharray="3 8"></path><path opacity="0" className="drop w" style={{animationDelay: "0.14s"}} d="M78 62L77.4 104" strokeWidth="2" strokeDasharray="3 8"></path><path opacity="0" className="drop w" style={{animationDelay: "0.21000000000000002s"}} d="M86 62L87.8 104" strokeWidth="2" strokeDasharray="3 8"></path><path opacity="0" className="drop w" style={{animationDelay: "0.28s"}} d="M94 62L98.2 104" strokeWidth="2" strokeDasharray="3 8"></path>
<g className="hand"><path className="bg" d="M116 78L106 106Q108 110 112 108L122 80Z"></path><ellipse className="bg" cx="122" cy="68" rx="10" ry="13" transform="rotate(20 122 68)"></ellipse><circle cx="118" cy="65" r=".9" fill="currentColor" stroke="none"></circle><circle cx="122" cy="63" r=".9" fill="currentColor" stroke="none"></circle><circle cx="126" cy="65" r=".9" fill="currentColor" stroke="none"></circle><circle cx="118" cy="70" r=".9" fill="currentColor" stroke="none"></circle><circle cx="122" cy="68" r=".9" fill="currentColor" stroke="none"></circle><circle cx="126" cy="70" r=".9" fill="currentColor" stroke="none"></circle><circle cx="122" cy="73" r=".9" fill="currentColor" stroke="none"></circle></g>
  </svg>
);

export const BathroomAccessoriesIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs><clipPath id="ba-tc"><rect x="80" y="40" width="40" height="70"></rect></clipPath></defs>

<rect className="bg soap" x="84" y="36" width="32" height="10" rx="5"></rect><path className="bg" d="M74 46L126 46Q124 58 100 60Q76 58 74 46Z"></path><path d="M92 60V68H108V60"></path>
<path className="bg soap s2" d="M38 116Q50 100 62 116"></path><path className="bg" d="M26 116L74 116Q72 128 50 130Q28 128 26 116Z"></path>
<g clipPath="url(#ba-tc)"><g className="brush" transform="translate(0 24)"><path d="M104 70V100" strokeWidth="3"></path><rect x="100" y="62" width="8" height="10" rx="2" fill="#3b9ad6" fillOpacity=".4"></rect></g></g>
<path className="bg" d="M86 92L114 92L110 132L90 132Z"></path><rect className="bg" x="88" y="132" width="24" height="10" rx="2"></rect>
<circle className="bg" cx="152" cy="82" r="6"></circle><g className="ring"><circle cx="152" cy="116" r="22"></circle><circle cx="152" cy="116" r="17"></circle><path d="M152 88V94"></path></g>
  </svg>
);

export const LedBathroomMirrorsIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs><filter id="lm-bl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter></defs>

<rect opacity="0" className="glow" x="46" y="36" width="108" height="128" rx="7" stroke="#fff5b8" strokeWidth="10" filter="url(#lm-bl)"></rect>
<rect x="36" y="26" width="128" height="148" rx="12"></rect><rect x="46" y="36" width="108" height="128" rx="7"></rect>
<path className="sh" d="M58 60L72 46M60 72L82 50M58 82L66 74" strokeWidth="2"></path><path className="sh sh2" d="M134 154L146 142M132 144L140 136" strokeWidth="2"></path>
<rect className="btn" x="90" y="148" width="7" height="7" rx="1.5" strokeWidth="2"></rect><rect className="btn" x="103" y="148" width="7" height="7" rx="1.5" strokeWidth="2"></rect>
  </svg>
);

export const KitchenSinksIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs></defs>

<rect x="14" y="62" width="172" height="78" rx="4"></rect><rect x="19" y="67" width="162" height="68" rx="3"></rect>
<rect x="26" y="73" width="52" height="58" rx="6"></rect><rect x="31" y="78" width="42" height="48" rx="4"></rect>
<circle opacity="0" className="rip w" cx="50" cy="92" r="6" strokeWidth="1.8"></circle><circle opacity="0" className="rip r2 w" cx="50" cy="92" r="6" strokeWidth="1.8"></circle><circle cx="50" cy="92" r="5"></circle><circle cx="50" cy="92" r="1.8"></circle>
<rect x="84" y="78" width="28" height="48" rx="5"></rect><circle opacity="0" className="rip r3 w" cx="98" cy="100" r="4.5" strokeWidth="1.6"></circle><circle cx="98" cy="100" r="4"></circle><circle cx="98" cy="100" r="1.5"></circle>
<path d="M120 80H176M120 88H176M120 96H176M120 104H176M120 112H176M120 120H176"></path>
  </svg>
);

export const KitchenFaucetsIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs></defs>

<path className="coil" d="M66 72L60.1 68.7L72.3 67.1L61.0 62.2L73.3 62.3L62.8 55.9L75.0 57.7L65.4 49.9L77.2 53.3L68.8 44.3L80.1 49.3L72.9 39.2L83.4 45.7L77.7 34.8L87.2 42.6L83.1 31.0L91.4 40.0L88.9 28.0L95.9 38.1L95.0 25.8L100.7 36.8L101.5 24.4L105.5 36.1L108.0 24.0L110.5 36.1L114.5 24.4L115.3 36.8L121.0 25.8L120.1 38.1L127.1 28.0L124.6 40.0L132.9 31.0L128.8 42.6L138.3 34.8L132.6 45.7L143.1 39.2L135.9 49.3L147.2 44.3L138.8 53.3L150.6 49.9L141.0 57.7L153.2 55.9L142.7 62.3L155.0 62.2L143.7 67.1L155.9 68.7L144.0 72.0L156 74L144 77L156 80L144 83L156 86L144 89" strokeWidth="2"></path>
<path d="M63 70V126M70 70V126"></path><path d="M70 110H146"></path>
<rect className="bg" x="60" y="124" width="18" height="46" rx="2"></rect><path className="bg" d="M78 140H90V150H78"></path><path className="lev" d="M86 140V116" strokeWidth="3"></path>
<rect className="bg" x="54" y="170" width="30" height="6" rx="2"></rect>
<g className="head"><rect className="bg" x="145" y="90" width="10" height="34" rx="3"></rect><rect className="bg" x="142" y="124" width="16" height="7" rx="2"></rect>
<path opacity="0" className="flow w" d="M146 133L142 170M150 133V172M154 133L158 170" strokeWidth="2"></path></g>
  </svg>
);

export const CabinetHandlesIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs></defs>

<path className="shd" d="M48 146L156 120" stroke="currentColor" strokeWidth="3" opacity=".12"></path>
<path className="bg h" d="M44 144L40 126Q38 112 52 109L148 88Q162 86 165 100L167 114L158 116L156 106Q154 98 146 100L60 120Q51 122 53 132L55 144Z"></path>
  </svg>
);

export const DrawerSystemsStorageIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 200 200" className={mergeClass("kb", p.className)}>
    <defs></defs>

<path d="M28 62L28 150L72 180M28 62L128 62M128 62V70"></path>
<g className="d2"><rect className="bg" x="72" y="140" width="100" height="38"></rect><path d="M66 154V164" strokeWidth="3"></path></g><g className="d1"><path className="bg" d="M72 96L172 96L128 66L28 66Z"></path><path d="M57 66L91 96M90 66L124 96M43 76L143 76M58 86L158 86" strokeWidth="2"></path><rect className="bg" x="72" y="96" width="100" height="38"></rect><path d="M72 96L28 66M172 96L128 66" strokeWidth="2"></path><path d="M66 110V120" strokeWidth="3"></path></g>
  </svg>
);

export const kitchenBathSubcategoryIconMap: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  "Wash basins and vanity units": WashBasinsVanityIcon,
  "Faucets and mixers": FaucetsMixersIcon,
  "Showers and shower sets": ShowersSetsIcon,
  "Bathroom accessories": BathroomAccessoriesIcon,
  "LED and bathroom mirrors": LedBathroomMirrorsIcon,
  "Kitchen sinks": KitchenSinksIcon,
  "Kitchen faucets": KitchenFaucetsIcon,
  "Cabinet handles": CabinetHandlesIcon,
  "Drawer systems and storage accessories": DrawerSystemsStorageIcon,
};
