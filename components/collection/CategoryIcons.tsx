import React from "react";

/**
 * Hand-drawn line-art icon set for the 8 product categories — one visual
 * family (1.4px stroke, round caps/joins, 24x24 viewBox, no fill except
 * where a solid accent reads better at small size) so they sit together as
 * a set rather than a mismatched icon-pack grab-bag. All use currentColor,
 * so they inherit the gold/ink theme wherever they're placed.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const LightingIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M9 3.5h6l1.4 5.6a1 1 0 0 1-.97 1.24H8.57a1 1 0 0 1-.97-1.24L9 3.5Z" />
    <path d="M10.2 10.3v2.1a1.8 1.8 0 0 0 3.6 0v-2.1" />
    <path d="M12 14.4v3.4" />
    <circle cx="12" cy="19.3" r="1.3" />
  </svg>
);

export const FurnitureIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M6.5 11V8.2A2.2 2.2 0 0 1 8.7 6h6.6a2.2 2.2 0 0 1 2.2 2.2V11" />
    <path d="M5 11h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-.6M5 11a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h.6" />
    <path d="M5.6 16v2.4M18.4 16v2.4" />
    <path d="M7.5 16h9" />
  </svg>
);

export const HomeDecorIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M9.6 10.2c-.9-1-1.3-2.1-1-3.4.3-1.3 1.3-2.3 2.6-2.7.3.7.4 1.5.2 2.3 1-.5 2-.5 2.9 0 .9.5 1.5 1.4 1.7 2.4" />
    <path d="M9.3 10.6h5.4l-.9 8a1.4 1.4 0 0 1-1.4 1.3h-.8a1.4 1.4 0 0 1-1.4-1.3l-.9-8Z" />
  </svg>
);

export const TilesIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="4" width="7" height="7" rx="0.6" />
    <rect x="13" y="4" width="7" height="7" rx="0.6" />
    <rect x="4" y="13" width="7" height="7" rx="0.6" />
    <rect x="13" y="13" width="7" height="7" rx="0.6" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export const KitchenBathIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M7 11.5h10a1 1 0 0 1 1 1 5.5 5.5 0 0 1-5.5 5.5h-1A5.5 5.5 0 0 1 6 12.5a1 1 0 0 1 1-1Z" />
    <path d="M9.5 20h5" />
    <path d="M9 11.5V9.8c0-1 .8-1.8 1.8-1.8H12" />
    <path d="M12 5.2v2.8M10 5.6l1.3 1.3M14 5.6l-1.3 1.3" />
  </svg>
);

export const ExteriorIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <rect x="6" y="3.5" width="12" height="17" rx="0.6" />
    <path d="M9.5 3.5v17" />
    <circle cx="8" cy="12" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const GardenIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M12 13.5v6.3" />
    <path d="M12 13.5c-2.6 0-4.6-1.8-4.9-4.4 2.6 0 4.5 1.5 4.9 3.6.4-2.1 2.3-3.6 4.9-3.6-.3 2.6-2.3 4.4-4.9 4.4Z" />
    <path d="M12 10.4C10.9 9.6 10.3 8.4 10.5 7c1.1.2 2 .9 2.4 1.9.3-1 .1-2-.5-2.9 1.1 0 2.1.6 2.6 1.6.5 1 .4 2.1-.3 3" />
    <path d="M8.6 20h6.8" />
  </svg>
);

export const ShopTheLookIcon: React.FC<IconProps> = (props) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="4" width="17" height="16" rx="0.8" />
    <path d="M6.5 15.5l3-3.2a1 1 0 0 1 1.5 0l2 2.2 1.8-2a1 1 0 0 1 1.5 0l1.7 2" />
    <circle cx="8.3" cy="8.8" r="1.1" />
  </svg>
);

export const categoryIconMap: Record<string, React.FC<IconProps>> = {
  lighting: LightingIcon,
  furniture: FurnitureIcon,
  "home-decor": HomeDecorIcon,
  "tiles-finishes": TilesIcon,
  "kitchen-bath": KitchenBathIcon,
  exterior: ExteriorIcon,
  "garden-landscape": GardenIcon,
  "shop-the-look": ShopTheLookIcon,
};
