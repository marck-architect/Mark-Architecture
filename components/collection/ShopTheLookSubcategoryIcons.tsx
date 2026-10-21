import type { SVGProps } from "react";

/**
 * Shop the Look subcategory icons — converted from the client's room-scene
 * SVG set (collections/*.svg), 240x180 viewBox (wider than the other packs'
 * square icons). Pure structural charcoal (#26352d) was retargeted to
 * currentColor for brand theming; the sage-green, off-white, water-blue and
 * warm-glow accent colors are literal and left as supplied. Every scene
 * shares a warm lamp-glow treatment plus its own scene-specific touch
 * (pendant swing, rising steam/bubbles/smoke, swaying trees, floating zzz).
 */

type IconProps = SVGProps<SVGSVGElement>;

const mergeClass = (base: string, extra?: string) => [base, extra].filter(Boolean).join(" ");

export const ShopTheLookIconStyles = () => (
  <style>{`
svg.sl{width:100%;height:100%;overflow:visible;color:inherit;fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;transition:filter .35s}
svg.sl:hover{filter:drop-shadow(0 0 4px rgba(154,118,64,.3))}

@keyframes slglow{to{opacity:1}}
svg.sl:hover .cn,svg.sl:hover .hl,svg.sl:hover .gl{animation:slglow .5s ease forwards}

@keyframes slswing{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
svg.sl .pend{transform-box:fill-box;transform-origin:top center}
svg.sl:hover .pend{animation:slswing 2.4s ease-in-out infinite}

@keyframes slnudge{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
svg.sl:hover .sc,svg.sl:hover .ch{animation:slnudge 1.8s ease-in-out infinite}

@keyframes slzzz{0%{opacity:0;transform:translateY(4px)}30%{opacity:1}100%{opacity:0;transform:translateY(-14px)}}
svg.sl:hover .z{animation:slzzz 2.2s ease-in-out infinite}
svg.sl:hover .z.z2{animation-delay:.3s}
svg.sl:hover .z.z3{animation-delay:.6s}

@keyframes slbubble{0%{opacity:0;transform:translateY(6px) scale(.6)}30%{opacity:.8}100%{opacity:0;transform:translateY(-16px) scale(1.1)}}
svg.sl:hover .bb{animation:slbubble 1.6s ease-in-out infinite}
@keyframes sldrip{0%{opacity:0;transform:translateY(-4px)}20%{opacity:1}80%{opacity:1;transform:translateY(16px)}100%{opacity:0;transform:translateY(20px)}}
svg.sl:hover .drip{animation:sldrip 1.2s ease-in infinite}
@keyframes slshine{0%{opacity:0;transform:translateX(-10px)}50%{opacity:.8}100%{opacity:0;transform:translateX(10px)}}
svg.sl:hover .shn{animation:slshine 1.6s ease-in-out infinite}

@keyframes slsteam{0%{opacity:0;transform:translateY(4px)}40%{opacity:.8}100%{opacity:0;transform:translateY(-10px)}}
svg.sl:hover .st{animation:slsteam 1.6s ease-in-out infinite}
@keyframes slburn{0%,100%{opacity:.6}50%{opacity:1}}
svg.sl:hover .bn{animation:slburn 1s ease-in-out infinite}

svg.sl .wn{transition:fill .5s}
svg.sl:hover .wn{fill:#ffe98a}
@keyframes slsmoke{0%{opacity:0;transform:translateY(4px) scale(.7)}30%{opacity:.7}100%{opacity:0;transform:translateY(-14px) scale(1.3)}}
svg.sl:hover .smk{animation:slsmoke 2s ease-in-out infinite}

@keyframes sltree{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
svg.sl .tr,svg.sl .pt{transform-box:fill-box;transform-origin:bottom center}
svg.sl:hover .tr,svg.sl:hover .pt{animation:sltree 2.6s ease-in-out infinite}
@keyframes slbush{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
svg.sl .bu{transform-box:fill-box;transform-origin:center}
svg.sl:hover .bu{animation:slbush 2s ease-in-out infinite}

@keyframes slsun{0%{opacity:0;transform:rotate(0deg) scale(.8)}100%{opacity:1;transform:rotate(25deg) scale(1)}}
svg.sl .sun{transform-box:fill-box;transform-origin:center}
svg.sl:hover .sun{animation:slsun 1.6s ease-out forwards}
`}</style>
);

export const LivingRoomIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="lr-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="lr-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<path opacity="0" className="cn" d="M198 50L170 165L240 165L226 50Z" fill="url(#lr-cone)" stroke="none"></path>
<rect fill="#8cc79e" className="g" x="30" y="50" width="140" height="70" rx="12"></rect><rect fill="#8cc79e" className="g cu" x="40" y="50" width="60" height="50" rx="11"></rect><rect fill="#8cc79e" className="g cu c2" x="100" y="50" width="60" height="50" rx="11"></rect>
<rect fill="#8cc79e" className="g" x="12" y="72" width="30" height="70" rx="14"></rect><rect fill="#8cc79e" className="g" x="158" y="72" width="30" height="70" rx="14"></rect>
<rect fill="#8cc79e" className="g cu" x="40" y="98" width="60" height="22" rx="7"></rect><rect fill="#8cc79e" className="g cu c2" x="100" y="98" width="60" height="22" rx="7"></rect>
<rect fill="#8cc79e" className="g" x="24" y="118" width="152" height="24" rx="4"></rect><path d="M14 132Q18 142 32 142H168Q182 142 186 132" strokeWidth="2"></path>
<path fill="#8cc79e" className="g" d="M30 142L26 156L34 156L40 142Z" strokeWidth="2.5"></path><path fill="#8cc79e" className="g" d="M170 142L174 156L166 156L160 142Z" strokeWidth="2.5"></path>
<path d="M212 50V165M196 165H228" strokeWidth="3"></path><path fill="#e8ebe8" className="shade l" d="M196 50L228 50L220 16L204 16Z"></path><g className="cord"><path d="M204 50V74" strokeWidth="1.8"></path><circle cx="204" cy="76" r="2.6" fill="currentColor" stroke="none"></circle></g>
  </svg>
);

export const BedroomIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="br-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="br-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<rect fill="#e8ebe8" className="l" x="22" y="28" width="150" height="94" rx="12"></rect><rect fill="#e8ebe8" className="l pl" x="38" y="46" width="54" height="34" rx="9"></rect><rect fill="#e8ebe8" className="l pl p2" x="102" y="46" width="54" height="34" rx="9"></rect>
<path fill="#8cc79e" className="g bl" d="M12 122Q12 94 38 94L156 94Q182 94 182 122Z"></path><path fill="#e8ebe8" className="l" d="M6 122H188V165H172Q168 148 154 148H40Q26 148 22 165H6Z"></path>
<rect fill="#e8ebe8" className="l" x="190" y="102" width="44" height="56" rx="2"></rect><g className="dr"><rect fill="#e8ebe8" className="l" x="194" y="106" width="36" height="20" rx="1.5" strokeWidth="2"></rect><path d="M208 116H216" strokeWidth="2.5"></path></g><rect fill="#e8ebe8" className="l" x="194" y="130" width="36" height="20" rx="1.5" strokeWidth="2"></rect><path d="M208 140H216" strokeWidth="2.5"></path><path d="M194 158V166M230 158V166" strokeWidth="3"></path>
<g fontFamily="system-ui,sans-serif" fontWeight="700" fill="currentColor" stroke="none"><text opacity="0" className="z" x="160" y="38" fontSize="14">z</text><text opacity="0" className="z z2" x="160" y="38" fontSize="18">z</text><text opacity="0" className="z z3" x="160" y="38" fontSize="12">z</text></g>
  </svg>
);

export const DiningRoomIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="dn-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="dn-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<g className="pend"><path d="M120 0V22" strokeWidth="2.2"></path><ellipse opacity="0" className="gl" cx="120" cy="80" rx="70" ry="50" fill="url(#dn-glow)" stroke="none"></ellipse><rect x="115" y="20" width="10" height="6" rx="2" fill="#8cc79e" className="g"></rect><path fill="#8cc79e" className="dome g" d="M98 46Q98 26 120 26Q142 26 142 46Z"></path><path fill="#e8ebe8" className="l" d="M112 46A8 8 0 0 0 128 46Z" strokeWidth="2.5"></path></g>
<g><path fill="#e8ebe8" className="l" d="M92 86V62Q92 56 98 56H108Q114 56 114 62V86Z" strokeWidth="2.5"></path><rect fill="#e8ebe8" className="l" x="90" y="112" width="26" height="6" strokeWidth="2.5"></rect><path d="M94 118L92 166M112 118L114 166" strokeWidth="3"></path></g><g><path fill="#e8ebe8" className="l" d="M126 86V62Q126 56 132 56H142Q148 56 148 62V86Z" strokeWidth="2.5"></path><rect fill="#e8ebe8" className="l" x="124" y="112" width="26" height="6" strokeWidth="2.5"></rect><path d="M128 118L126 166M146 118L148 166" strokeWidth="3"></path></g><rect fill="#e8ebe8" className="l" x="62" y="86" width="116" height="8" rx="2"></rect><path d="M76 94L70 166M82 94L76 166M164 94L170 166M158 94L164 166" strokeWidth="2.5"></path>
<g className="sc" transform=""><path d="M14 58L22 120M14 58Q10 56 12 54" strokeWidth="3"></path><path fill="#e8ebe8" className="l" d="M20 116L58 116L58 122L20 122Z" strokeWidth="2.5"></path><path d="M24 122L20 166M54 122L58 166" strokeWidth="3"></path></g><g className="sc r" transform="translate(240 0) scale(-1 1)"><path d="M14 58L22 120M14 58Q10 56 12 54" strokeWidth="3"></path><path fill="#e8ebe8" className="l" d="M20 116L58 116L58 122L20 122Z" strokeWidth="2.5"></path><path d="M24 122L20 166M54 122L58 166" strokeWidth="3"></path></g>
  </svg>
);

export const KitchenCollectionIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="kt-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="kt-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<rect fill="#e8ebe8" className="l" x="178" y="4" width="24" height="46"></rect><path fill="#e8ebe8" className="l" d="M158 64L222 64L210 48L170 48Z"></path><rect fill="#e8ebe8" className="l" x="156" y="64" width="68" height="6"></rect><rect opacity="0" className="hl" x="166" y="70" width="48" height="10" fill="url(#kt-cone)" stroke="none"></rect>
<path opacity="0" className="st" d="M178 82Q172 76 178 72M190 84Q196 78 190 72M202 82Q196 76 202 72" stroke="#fff" strokeWidth="2"></path>
<path fill="#e8ebe8" className="l" d="M30 80H220L230 92H20Z"></path><path d="M40 82H86L84 90H38Z" strokeWidth="2"></path><path d="M62 82V66Q62 60 68 60Q74 60 74 66V70M58 70H66" strokeWidth="2.5"></path>
<path d="M166 82H214L218 90H164Z" strokeWidth="2" fill="#e8ebe8" className="l"></path><ellipse className="bn" cx="182" cy="86" rx="5" ry="2" strokeWidth="1.8"></ellipse><ellipse className="bn" cx="202" cy="86" rx="5" ry="2" strokeWidth="1.8"></ellipse>
<rect fill="#e8ebe8" className="l" x="20" y="92" width="210" height="8"></rect><rect fill="#e8ebe8" className="l" x="24" y="100" width="202" height="60"></rect><path d="M90 100V160M186 100V160" strokeWidth="2.5"></path>
<g className="drw"><path d="M90 128H186" strokeWidth="2.5"></path><path d="M130 112H146M130 144H146" strokeWidth="2"></path></g><path d="M186 128H226" strokeWidth="2.5"></path><rect fill="#8cc79e" className="g" x="30" y="160" width="190" height="6"></rect>
  </svg>
);

export const BathroomCollectionIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="bt-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="bt-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<clipPath id="bt-mc"><rect x="190" y="48" width="34" height="46"></rect></clipPath><path d="M22 110V84Q22 76 30 76Q38 76 38 84V88" strokeWidth="3"></path><circle opacity="0" className="drip" cx="38" cy="94" r="2" fill="#3b9ad6" stroke="none"></circle><circle opacity="0" className="bb" style={{animationDelay: "0s"}} cx="40" cy="104" r="4" fill="#fff" fillOpacity=".6" strokeWidth="1.5"></circle><circle opacity="0" className="bb" style={{animationDelay: "0.18s"}} cx="56" cy="100" r="3" fill="#fff" fillOpacity=".6" strokeWidth="1.5"></circle><circle opacity="0" className="bb" style={{animationDelay: "0.36s"}} cx="72" cy="106" r="5" fill="#fff" fillOpacity=".6" strokeWidth="1.5"></circle><circle opacity="0" className="bb" style={{animationDelay: "0.54s"}} cx="90" cy="100" r="3" fill="#fff" fillOpacity=".6" strokeWidth="1.5"></circle><circle opacity="0" className="bb" style={{animationDelay: "0.72s"}} cx="104" cy="104" r="4" fill="#fff" fillOpacity=".6" strokeWidth="1.5"></circle>
<path fill="#e8ebe8" className="l" d="M14 116Q16 150 40 152L100 152Q120 150 122 116Z"></path><rect fill="#e8ebe8" className="l" x="8" y="110" width="120" height="8" rx="4"></rect><path d="M34 152Q30 160 24 160M108 152Q112 160 118 160" strokeWidth="3"></path>
<rect fill="#e8ebe8" className="l" x="142" y="94" width="30" height="20" rx="6"></rect><ellipse fill="#e8ebe8" className="l" cx="157" cy="118" rx="19" ry="5"></ellipse><path fill="#e8ebe8" className="l" d="M140 120Q142 136 152 140L150 158H166L162 140Q172 136 174 120Z"></path>
<rect fill="#e8ebe8" className="l" x="188" y="46" width="38" height="50" rx="2"></rect><g clipPath="url(#bt-mc)"><rect className="shn" x="198" y="40" width="12" height="70" fill="#fff" stroke="none" opacity=".8" transform="skewX(-25)"></rect></g><path d="M200 70L214 56M206 74L218 62" strokeWidth="2"></path>
<path fill="#e8ebe8" className="l" d="M184 120L230 120Q228 132 207 134Q186 132 184 120Z"></path><path d="M207 120V110Q207 106 212 106V112" strokeWidth="2.5"></path><rect fill="#e8ebe8" className="l" x="186" y="132" width="42" height="34"></rect><path d="M207 132V166M202 146V152M212 146V152" strokeWidth="2"></path>
  </svg>
);

export const HouseElevationIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="he-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="he-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<g strokeWidth=".9" opacity=".5"><path className="sk" d="M28 72L104 0M70 16L166 98M6 164H234M30 176L110 150M150 150L214 176M40 104L210 104M140 60L226 62"></path></g>
<path d="M162 56V40H172V60" fill="#e8ebe8" className="l" strokeWidth="2"></path><circle opacity="0" className="smk" cx="167" cy="34" r="4" fill="#fff" stroke="none"></circle><circle opacity="0" className="smk" style={{animationDelay: ".6s"}} cx="167" cy="34" r="5" fill="#fff" stroke="none"></circle>
<path fill="#e8ebe8" className="l" d="M134 62L196 62L208 82L134 82Z" strokeWidth="2.5"></path><rect fill="#e8ebe8" className="l" x="138" y="82" width="62" height="80" strokeWidth="2.5"></rect>
<path fill="#e8ebe8" className="l" d="M38 80L90 26L142 80Z" strokeWidth="2.5"></path><rect fill="#e8ebe8" className="l" x="48" y="78" width="86" height="84" strokeWidth="2.5"></rect>
<path fill="#e8ebe8" className="l" d="M92 100L132 56L172 100Z" strokeWidth="2.5"></path><rect fill="#e8ebe8" className="l" x="102" y="98" width="60" height="64" strokeWidth="2.5"></rect>
<path fill="#e8ebe8" className="l" d="M24 128L210 128L204 118L30 118Z" strokeWidth="2.5"></path><path d="M30 128V162M66 128V162M98 128V162M166 128V162M204 128V162" strokeWidth="2"></path>
<rect className="wn" style={{transitionDelay: "0.0s"}} x="84" y="44" width="12" height="16" fill="#e8ebe8" strokeWidth="2.2"></rect><path d="M90 44V60M84 52H96" strokeWidth="1.4"></path><path d="M86 57l4.800000000000001 -8M90.6 58l4.199999999999999 -6.4" strokeWidth=".8" opacity=".5"></path><rect className="wn" style={{transitionDelay: "0.1s"}} x="60" y="92" width="24" height="20" fill="#e8ebe8" strokeWidth="2.2"></rect><path d="M72 92V112M60 102H84" strokeWidth="1.4"></path><path d="M62 109l9.600000000000001 -10M73.2 110l8.399999999999999 -8" strokeWidth=".8" opacity=".5"></path><rect className="wn" style={{transitionDelay: "0.2s"}} x="120" y="72" width="24" height="20" fill="#e8ebe8" strokeWidth="2.2"></rect><path d="M132 72V92M120 82H144" strokeWidth="1.4"></path><path d="M122 89l9.600000000000001 -10M133.2 90l8.399999999999999 -8" strokeWidth=".8" opacity=".5"></path><rect className="wn" style={{transitionDelay: "0.3s"}} x="176" y="90" width="16" height="22" fill="#e8ebe8" strokeWidth="2.2"></rect><path d="M184 90V112M176 101H192" strokeWidth="1.4"></path><path d="M178 109l6.4 -11M184.8 110l5.6 -8.8" strokeWidth=".8" opacity=".5"></path><rect className="wn" style={{transitionDelay: "0.4s"}} x="60" y="136" width="30" height="20" fill="#e8ebe8" strokeWidth="2.2"></rect><path d="M75 136V156M60 146H90" strokeWidth="1.4"></path><path d="M62 153l12 -10M76.5 154l10.5 -8" strokeWidth=".8" opacity=".5"></path><rect className="wn" style={{transitionDelay: "0.5s"}} x="176" y="136" width="16" height="20" fill="#e8ebe8" strokeWidth="2.2"></rect><path d="M184 136V156M176 146H192" strokeWidth="1.4"></path><path d="M178 153l6.4 -10M184.8 154l5.6 -8" strokeWidth=".8" opacity=".5"></path>
<rect className="wn" style={{transitionDelay: ".6s"}} x="122" y="134" width="20" height="28" fill="#e8ebe8" strokeWidth="2.2"></rect><path d="M126 138H138V150H126Z" strokeWidth="1.2"></path>
<path d="M18 162H222M14 166H226" strokeWidth="2.2"></path>
  </svg>
);

export const BalconyTerraceIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="bc-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="bc-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<g opacity="0" className="sun"><circle cx="120" cy="22" r="10" fill="#ffe98a" strokeWidth="2"></circle><path d="M120 4V8M120 36V40M102 22H106M134 22H138M107 9l3 3M130 32l3 3M133 9l-3 3M110 32l-3 3" strokeWidth="2"></path></g>
<path d="M18 52H222M18 126H222" strokeWidth="3"></path><path d="M28 56V126M40 56V126M52 56V126M64 56V126M76 56V126M88 56V126M100 56V126M112 56V126M124 56V126M136 56V126M148 56V126M160 56V126M172 56V126M184 56V126M196 56V126M208 56V126" strokeWidth="1.8"></path><path d="M18 52V130M222 52V130" strokeWidth="3.5"></path><circle cx="18" cy="46" r="4" fill="#e8ebe8" className="l" strokeWidth="2"></circle><circle cx="222" cy="46" r="4" fill="#e8ebe8" className="l" strokeWidth="2"></circle>
<g className="ch chl"><path d="M58 80L64 116L84 116M64 116L60 132M82 116L86 132" strokeWidth="2.5"></path></g><g className="ch chr"><path d="M182 80L176 116L156 116M176 116L180 132M158 116L154 132" strokeWidth="2.5"></path></g>
<rect fill="#e8ebe8" className="l" x="98" y="88" width="44" height="5" rx="2" strokeWidth="2.5"></rect><path d="M120 93V128M108 130H132" strokeWidth="2.5"></path>
<g className="pt"><path d="M198 108V60M198 96L184 84M198 86L212 70M198 74L186 60" strokeWidth="2"></path><path fill="#8cc79e" className="g" d="M198 60Q190 46 200 34Q206 48 198 60Z" strokeWidth="2"></path><path fill="#8cc79e" className="g" d="M184 84Q170 82 168 70Q182 70 184 84Z" strokeWidth="2"></path><path fill="#8cc79e" className="g" d="M212 70Q226 66 228 54Q214 56 212 70Z" strokeWidth="2"></path><path fill="#8cc79e" className="g" d="M186 60Q172 56 172 44Q186 46 186 60Z" strokeWidth="2"></path><path fill="#8cc79e" className="g" d="M198 96Q214 96 218 86Q204 84 198 96Z" strokeWidth="2"></path></g>
<path fill="#e8ebe8" className="l" d="M186 106H210L206 128H190Z" strokeWidth="2.5"></path>
<rect fill="#e8ebe8" className="l" x="8" y="130" width="224" height="10"></rect><rect fill="#e8ebe8" className="l" x="28" y="140" width="14" height="26"></rect><rect fill="#e8ebe8" className="l" x="198" y="140" width="14" height="26"></rect><path d="M42 146H198" strokeWidth="2"></path>
  </svg>
);

export const GardenLandscapeCollectionIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 240 180" className={mergeClass("sl", p.className)}>
    <defs><radialGradient id="gl2-glow"><stop offset="0" stopColor="#ffe98a" stopOpacity=".9"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></radialGradient><linearGradient id="gl2-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe98a" stopOpacity=".8"></stop><stop offset="1" stopColor="#ffe98a" stopOpacity="0"></stop></linearGradient></defs>
<g className="tr"><path d="M44 112V62M44 86L32 74M44 94L56 82" strokeWidth="2.5"></path></g><g className="tr" style={{animationDelay: ".12s"}}><path d="M80 108V70M80 90L70 80M80 96L90 86" strokeWidth="2.5"></path></g>
<g className="tr" style={{animationDelay: ".24s"}}><path d="M196 104V40M196 70L186 60M196 80L206 68" strokeWidth="2.5"></path></g><g className="tr" style={{animationDelay: ".36s"}}><path d="M168 112V76M168 92L158 84M168 98L178 90" strokeWidth="2.5"></path></g>
<path fill="#8cc79e" className="tr g" style={{animationDelay: "0.12s"}} d="M102.0 60.0A5.0 5.0 0 0 1 97.8 75.3A5.0 5.0 0 0 1 86.8 84.7A5.0 5.0 0 0 1 73.2 84.7A5.0 5.0 0 0 1 62.2 75.3A5.0 5.0 0 0 1 58.0 60.0A5.0 5.0 0 0 1 62.2 44.7A5.0 5.0 0 0 1 73.2 35.3A5.0 5.0 0 0 1 86.8 35.3A5.0 5.0 0 0 1 97.8 44.7A5.0 5.0 0 0 1 102.0 60.0Z"></path><path fill="#5c9e72" className="tr gd" style={{animationDelay: "0s"}} d="M70.0 52.0A5.9 5.9 0 0 1 65.0 69.6A5.9 5.9 0 0 1 52.0 80.5A5.9 5.9 0 0 1 36.0 80.5A5.9 5.9 0 0 1 23.0 69.6A5.9 5.9 0 0 1 18.0 52.0A5.9 5.9 0 0 1 23.0 34.4A5.9 5.9 0 0 1 36.0 23.5A5.9 5.9 0 0 1 52.0 23.5A5.9 5.9 0 0 1 65.0 34.4A5.9 5.9 0 0 1 70.0 52.0Z"></path><path fill="#8cc79e" className="tr g" style={{animationDelay: "0.36s"}} d="M188.0 72.0A4.5 4.5 0 0 1 184.2 83.8A4.5 4.5 0 0 1 174.2 91.0A4.5 4.5 0 0 1 161.8 91.0A4.5 4.5 0 0 1 151.8 83.8A4.5 4.5 0 0 1 148.0 72.0A4.5 4.5 0 0 1 151.8 60.2A4.5 4.5 0 0 1 161.8 53.0A4.5 4.5 0 0 1 174.2 53.0A4.5 4.5 0 0 1 184.2 60.2A4.5 4.5 0 0 1 188.0 72.0Z"></path><path fill="#5c9e72" className="tr gd" style={{animationDelay: ".24s"}} d="M196 18Q218 30 218 66Q216 92 196 92Q176 92 174 66Q174 30 196 18Z"></path>
<g stroke="currentColor" strokeWidth="2.5"><path d="M44 112V70M44 90L32 78M44 98L56 86" opacity=".9" className="tr"></path><path d="M80 108V74M80 92L70 82M80 98L90 88" className="tr" style={{animationDelay: ".12s"}}></path><path d="M196 104V48M196 74L186 64M196 84L206 72" className="tr" style={{animationDelay: ".24s"}}></path><path d="M168 112V80M168 96L158 88M168 100L178 92" className="tr" style={{animationDelay: ".36s"}}></path></g>
<path fill="#5c9e72" className="bu gd" style={{animationDelay: "0s"}} d="M12 120A6.0 6.0 0 0 1 14.1 113.6A6.0 6.0 0 0 1 20.0 108.9A6.0 6.0 0 0 1 28.0 107.2A6.0 6.0 0 0 1 36.0 108.9A6.0 6.0 0 0 1 41.9 113.6A6.0 6.0 0 0 1 44.0 120.0Z"></path><path fill="#8cc79e" className="bu g" style={{animationDelay: "0.1s"}} d="M48 114A6.8 6.8 0 0 1 50.4 106.8A6.8 6.8 0 0 1 57.0 101.5A6.8 6.8 0 0 1 66.0 99.6A6.8 6.8 0 0 1 75.0 101.5A6.8 6.8 0 0 1 81.6 106.8A6.8 6.8 0 0 1 84.0 114.0Z"></path><path fill="#5c9e72" className="bu gd" style={{animationDelay: "0.2s"}} d="M94 112A5.3 5.3 0 0 1 95.9 106.4A5.3 5.3 0 0 1 101.0 102.3A5.3 5.3 0 0 1 108.0 100.8A5.3 5.3 0 0 1 115.0 102.3A5.3 5.3 0 0 1 120.1 106.4A5.3 5.3 0 0 1 122.0 112.0Z"></path><path fill="#8cc79e" className="bu g" style={{animationDelay: "0.30000000000000004s"}} d="M136 112A5.3 5.3 0 0 1 137.9 106.4A5.3 5.3 0 0 1 143.0 102.3A5.3 5.3 0 0 1 150.0 100.8A5.3 5.3 0 0 1 157.0 102.3A5.3 5.3 0 0 1 162.1 106.4A5.3 5.3 0 0 1 164.0 112.0Z"></path><path fill="#8cc79e" className="bu g" style={{animationDelay: "0.4s"}} d="M194 110A7.5 7.5 0 0 1 196.7 102.0A7.5 7.5 0 0 1 204.0 96.1A7.5 7.5 0 0 1 214.0 94.0A7.5 7.5 0 0 1 224.0 96.1A7.5 7.5 0 0 1 231.3 102.0A7.5 7.5 0 0 1 234.0 110.0Z"></path><path fill="#5c9e72" className="bu gd" style={{animationDelay: "0.5s"}} d="M16 152A6.8 6.8 0 0 1 18.4 144.8A6.8 6.8 0 0 1 25.0 139.5A6.8 6.8 0 0 1 34.0 137.6A6.8 6.8 0 0 1 43.0 139.5A6.8 6.8 0 0 1 49.6 144.8A6.8 6.8 0 0 1 52.0 152.0Z"></path><path fill="#5c9e72" className="bu gd" style={{animationDelay: "0.6000000000000001s"}} d="M60 156A5.3 5.3 0 0 1 61.9 150.4A5.3 5.3 0 0 1 67.0 146.3A5.3 5.3 0 0 1 74.0 144.8A5.3 5.3 0 0 1 81.0 146.3A5.3 5.3 0 0 1 86.1 150.4A5.3 5.3 0 0 1 88.0 156.0Z"></path>
<path d="M112 172Q200 140 140 128Q120 120 170 112M150 176Q240 150 180 130Q164 122 214 116" strokeWidth="2.8"></path><path className="path" d="M131 174Q220 145 160 129Q142 121 192 114" strokeWidth="1.5" opacity=".7"></path>
<path className="bu" d="M200 160L196 140L204 150L208 132L212 150L220 138L218 160Z" fill="#5c9e72" strokeWidth="2.2"></path><path d="M14 120H40M54 114H84" strokeWidth="2"></path>
  </svg>
);

export const shopTheLookSubcategoryIconMap: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  "Living room collections": LivingRoomIcon,
  "Bedroom collections": BedroomIcon,
  "Dining room collections": DiningRoomIcon,
  "Kitchen collections": KitchenCollectionIcon,
  "Bathroom collections": BathroomCollectionIcon,
  "House elevation collections": HouseElevationIcon,
  "Balcony and terrace collections": BalconyTerraceIcon,
  "Garden and landscape collections": GardenLandscapeCollectionIcon,
};
