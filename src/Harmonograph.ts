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
  harmonograph: Harmonograph,
  currentMode: string,
): Harmonograph {
  const randomized: Harmonograph = { ...harmonograph };
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

export function getDefaultHarmonograph(): Harmonograph {
  const defaults: Harmonograph = {} as Harmonograph;
  for (const [key, range] of Object.entries(inputRanges)) {
    defaults[key as keyof Harmonograph] = range.default;
  }

  return defaults;
}

export function createSVGString(harmonograph: Harmonograph): string {
  var height = harmonograph.r;
  var width = harmonograph.r;
  var stroke = harmonograph.w;
  var scale = 0.5;
  var data = createSVGPathData(harmonograph);
  var svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="${data}" stroke="black" stroke-width="${stroke}" stroke-linecap="round" transform="scale(${scale}, ${scale}) translate(${width}, ${height})"/>
    </svg>`;

  return svg;
}

function getXY(harmonograph: Harmonograph, step: number) {
  var alpha =
    toRadians(harmonograph.A) *
    Math.sin(
      2.0 * Math.PI * (harmonograph.f * step + harmonograph.u),
    ) *
    Math.exp(-harmonograph.R * step);
  var beta =
    toRadians(harmonograph.B) *
    Math.sin(
      2.0 * Math.PI * (harmonograph.g * step + harmonograph.v),
    ) *
    Math.exp(-harmonograph.S * step);
  var gamma = 2.0 * Math.PI * harmonograph.h * step;

  var xa =
    harmonograph.p * Math.cos(alpha) +
    harmonograph.q * Math.sin(alpha) -
    harmonograph.d;
  var ya = harmonograph.q * Math.cos(alpha) - harmonograph.p * Math.sin(alpha);
  var xb = xa * Math.cos(beta) - ya * Math.sin(beta);
  var yb = ya * Math.cos(beta) + xa * Math.sin(beta) - harmonograph.c;
  var x = xb * Math.cos(gamma) - yb * Math.sin(gamma);
  var y = yb * Math.cos(gamma) + xb * Math.sin(gamma);

  return { x: x, y: y };
}

export function createSVGPathData(harmonograph: Harmonograph): String {
  var step = 0;

  var startCoords = getXY(harmonograph, step);
  var xs = [startCoords.x];
  var ys = [startCoords.y];

  // Calculate the location of each point in the bezier path
  for (var i = 0; i < harmonograph.steps; ++i) {
    for (var j = 0; j < harmonograph.segments; ++j) {
      step += 1 / harmonograph.segments;
      var coords = getXY(harmonograph, step);
      xs.push(coords.x);
      ys.push(coords.y);
    }
  }

  var n = xs.length;
  var factor = 0.5 / 3; // Magic number
  var rxs = [];
  var rys = [];
  var cxs = [];
  var cys = [];

  // Add control points for each path point
  for (var i = 0; i < n; i += 1) {
    var prev = Math.max(0, i - 1);
    var next = Math.min(n - 1, i + 1);
    rxs.push(xs[i]);
    rys.push(ys[i]);
    cxs.push(factor * (xs[next] - xs[prev]));
    cys.push(factor * (ys[next] - ys[prev]));
  }

  var rn = rxs.length;

  // M = Move explicitly to the first point
  // C = Create curve explicitly from x0,y0 ending at x1,y1 (with control points)
  var data = [
    "M",
    round(rxs[0]),
    round(rys[0]),
    "C",
    round(rxs[0] + cxs[0]),
    round(rys[0] + cys[0]) + ",",
    round(rxs[1] - cxs[1]),
    round(rys[1] - cys[1]) + ",",
    round(rxs[1]),
    round(rys[1]),
  ];

  if (rn > 2) {
    // S = Severial Bezier paths, continuing where the last one left off to the next x,y (with control points)
    data.push("S");
    for (var i = 2; i < rn; i++) {
      data.push(round(rxs[i] - cxs[i]));
      data.push(round(rys[i] - cys[i]) + ",");
      data.push(round(rxs[i]));
      data.push(round(rys[i]));
    }
  }

  return data.join(" ");
}

function round(x: number) {
  return Math.round(x * 1000) / 1000;
}

function toRadians(degrees: number) {
  return (degrees / 180.0) * Math.PI;
}
