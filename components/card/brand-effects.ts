import type { PlatformId } from "./profile.config";

export interface BrandEffect {
  readonly color: string;
  readonly gradient?: readonly string[];
  readonly particles: readonly string[];
  readonly tilt: readonly number[];
  readonly pop: readonly number[];
}

export const BRAND_EFFECTS: Record<PlatformId, BrandEffect> = {
  instagram: {
    color: "#E4405F",
    gradient: ["#FEDA75", "#FA7E1E", "#D62976", "#962FBF", "#4F5BD5"],
    particles: ["#FEDA75", "#FA7E1E", "#D62976", "#962FBF", "#4F5BD5", "#D62976"],
    tilt: [0, -14, 10, -4, 0],
    pop: [1, 1.12, 0.96, 1.04, 1],
  },
  facebook: {
    color: "#0866FF",
    particles: ["#0866FF", "#4C8DFF", "#0866FF", "#8DB5FF", "#0866FF", "#4C8DFF"],
    tilt: [0, 0, 0, 0, 0],
    pop: [1, 1.2, 0.92, 1.06, 1],
  },
  whatsapp: {
    color: "#25D366",
    particles: ["#25D366", "#128C7E", "#25D366", "#7EE8A6", "#25D366", "#128C7E"],
    tilt: [0, -18, 14, -8, 0],
    pop: [1, 1.1, 1.1, 1.04, 1],
  },
  call: {
    color: "#C9A86E",
    particles: ["#C9A86E", "#E8C889", "#7E5714", "#E8C889", "#C9A86E", "#B89865"],
    tilt: [0, -20, 16, -10, 0],
    pop: [1, 1.08, 1.08, 1.02, 1],
  },
};
