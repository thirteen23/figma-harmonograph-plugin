export interface Harmonograph {
  d: number;
  c: number;
  p: number;
  q: number;
  r: number;
  A: number;
  B: number;
  u: number;
  v: number;
  R: number;
  S: number;
  f: number;
  g: number;
  h: number;
  w: number;
  steps: number;
  segments: number;
}

export const inputRanges: {
  [key: string]: {
    min: number;
    max: number;
    decimalPlaces: number;
    default: number;
    mode: string;
  };
} = {
  // Simple mode params
  f: { min: -0.5, max: 0.5, decimalPlaces: 3, default: 0.3, mode: "simple" },
  g: { min: -0.5, max: 0.5, decimalPlaces: 3, default: 0.302, mode: "simple" },
  A: { min: 1, max: 50, decimalPlaces: 0, default: 10, mode: "simple" },
  B: { min: 1, max: 50, decimalPlaces: 0, default: 10, mode: "simple" },
  steps: { min: 0, max: 5000, decimalPlaces: 0, default: 900, mode: "simple" },

  // Advanced mode params
  R: { min: 0, max: 0.009, decimalPlaces: 3, default: 0.001, mode: "advanced" },
  S: { min: 0, max: 0.009, decimalPlaces: 3, default: 0.001, mode: "advanced" },
  u: { min: 0, max: 0.2, decimalPlaces: 2, default: 0, mode: "advanced" },
  v: { min: 0, max: 0.2, decimalPlaces: 2, default: 0, mode: "advanced" },
  d: { min: 200, max: 1000, decimalPlaces: 0, default: 900, mode: "advanced" },
  c: { min: 200, max: 1000, decimalPlaces: 0, default: 800, mode: "advanced" },
  p: { min: 200, max: 1000, decimalPlaces: 0, default: 900, mode: "advanced" },
  q: { min: 200, max: 1000, decimalPlaces: 0, default: 700, mode: "advanced" },
  r: { min: 200, max: 900, decimalPlaces: 0, default: 300, mode: "advanced" },
  h: {
    min: 0,
    max: 0.001,
    decimalPlaces: 4,
    default: 0.0008,
    mode: "advanced",
  },
  w: { min: 0.1, max: 1, decimalPlaces: 1, default: 0.2, mode: "advanced" },
  segments: {
    min: 1,
    max: 100,
    decimalPlaces: 0,
    default: 32,
    mode: "advanced",
  },
};

export function randomizeInputs(
  currentMode: string,
  currentValues: Harmonograph,
): Harmonograph {
  const randomized: Harmonograph = { ...currentValues };
  for (const [key, range] of Object.entries(inputRanges)) {
    if (range.mode === currentMode || range.mode === "both") {
      const { min, max, decimalPlaces } = range;
      randomized[key as keyof Harmonograph] = Math.random() * (max - min) + min;

      const factor = Math.pow(10, decimalPlaces);
      randomized[key as keyof Harmonograph] =
        Math.round(randomized[key as keyof Harmonograph] * factor) / factor;
    }
  }
  return randomized;
}

export function getDefaultInputs(): Harmonograph {
  const defaults: Harmonograph = {} as Harmonograph;
  for (const [key, range] of Object.entries(inputRanges)) {
    defaults[key as keyof Harmonograph] = range.default;
  }
  return defaults;
}
