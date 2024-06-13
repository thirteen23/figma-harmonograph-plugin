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
  diameter: number;
  steps: number;
  segments: number;
}

export interface HarmonographInputConfig {
  minValue: number;
  maxValue: number;
  decimalPlaces: number;
}

export type HarmonographWithInputConfig = {
  [K in keyof Harmonograph]: {
    value: Harmonograph[K];
    config: HarmonographInputConfig;
  };
};
