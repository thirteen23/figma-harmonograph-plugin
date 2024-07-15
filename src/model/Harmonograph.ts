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

export enum Mode {
  advanced = "advanced-mode",
  simple = "simple-mode",
}

export const tooltips = {
  frequency: {
    header: "Frequency",
    tooltip: "Number of full pendulum swings per drawing step",
  },
  amplitude: {
    header: "Amplitude",
    tooltip:
      "The angle the pendulum moves left and right of the start position",
  },
  damping: {
    header: "Damping",
    tooltip: "Gradual reduction of the pendulum's amplitude over time",
  },
  phase: {
    header: "Phase",
    tooltip: "Starting position of the pendulum movement",
  },
  pendulumDistance: {
    header: "Distance between pendulums",
    tooltip: "Distance between the two pendulums",
  },
  paperCenter: {
    header: "Paper center",
    tooltip:
      "Distance from the top of the second pendulum to the center of the paper",
  },
  penArmLength: {
    header: "Length of pen arm",
    tooltip: "Length of attached pen from the first pendulum",
  },
  penArmPosition: {
    header: "Position of pen arm",
    tooltip:
      "Distance from the top of the harmonograph to the center of the pen arm",
  },
  paperRadius: {
    header: "Paper radius",
    tooltip: "Distance between the edge and center of the drawing area",
  },
  paperFrequency: {
    header: "Frequency of paper rotation",
    tooltip: "Number of paper rotations per drawing step",
  },
  penThickness: {
    header: "Pen thickness",
    tooltip: "Stroke thickness",
  },
  steps: {
    header: "Steps",
    tooltip: "Number of drawing cycles",
  },
  segments: {
    header: "Segments per step",
    tooltip: "Number of calculations per drawing cycle",
  },
};

export const inputRanges: {
  [key: string]: {
    name: string;
    min: number;
    max: number;
    rMin: number;
    rMax: number;
    decimalPlaces: number;
    default: number;
    increment: number;
    mode: string;
  };
} = {
  // Simple mode params
  f: {
    name: "Frequency left",
    min: -100,
    max: 100,
    rMin: -0.5,
    rMax: 0.5,
    decimalPlaces: 4,
    default: 0.3,
    increment: 0.001,
    mode: Mode.simple,
  },
  g: {
    name: "Frequency right",
    min: -100,
    max: 100,
    rMin: -0.5,
    rMax: 0.5,
    decimalPlaces: 4,
    default: 0.302,
    increment: 0.001,
    mode: Mode.simple,
  },
  A: {
    name: "Amplitude left",
    min: -360,
    max: 360,
    rMin: 1,
    rMax: 50,
    decimalPlaces: 0,
    default: 10,
    increment: 1,
    mode: Mode.simple,
  },
  B: {
    name: "Amplitude right",
    min: -360,
    max: 360,
    rMin: 1,
    rMax: 65,
    decimalPlaces: 0,
    default: 10,
    increment: 1,
    mode: Mode.simple,
  },
  steps: {
    name: "Steps",
    min: 1,
    max: 5000,
    rMin: 400,
    rMax: 5000,
    decimalPlaces: 0,
    default: 900,
    increment: 50,
    mode: Mode.simple,
  },

  // Advanced mode params
  R: {
    name: "Damping left",
    min: 0,
    max: 100,
    rMin: 0,
    rMax: 0.009,
    decimalPlaces: 3,
    default: 0.001,
    increment: 0.001,
    mode: Mode.advanced,
  },
  S: {
    name: "Damping right",
    min: 0,
    max: 100,
    rMin: 0,
    rMax: 0.009,
    decimalPlaces: 3,
    default: 0.001,
    increment: 0.001,
    mode: Mode.advanced,
  },
  u: {
    name: "Phase left",
    min: 0,
    max: 1,
    rMin: 0,
    rMax: 0.2,
    decimalPlaces: 2,
    default: 0,
    increment: 0.01,
    mode: Mode.advanced,
  },
  v: {
    name: "Phase right",
    min: 0,
    max: 1,
    rMin: 0,
    rMax: 0.2,
    decimalPlaces: 2,
    default: 0,
    increment: 0.01,
    mode: Mode.advanced,
  },
  d: {
    name: "Distance between pendulums",
    min: 10,
    max: 10000,
    rMin: 200,
    rMax: 1000,
    decimalPlaces: 0,
    default: 900,
    increment: 50,
    mode: Mode.advanced,
  },
  c: {
    name: "Paper center",
    min: 0,
    max: 10000,
    rMin: 200,
    rMax: 1000,
    decimalPlaces: 0,
    default: 800,
    increment: 50,
    mode: Mode.advanced,
  },
  p: {
    name: "Length of pen arm",
    min: 10,
    max: 10000,
    rMin: 200,
    rMax: 1000,
    decimalPlaces: 0,
    default: 900,
    increment: 10,
    mode: Mode.advanced,
  },
  q: {
    name: "Position of pen arm",
    min: 10,
    max: 10000,
    rMin: 200,
    rMax: 1000,
    decimalPlaces: 0,
    default: 700,
    increment: 10,
    mode: Mode.advanced,
  },
  r: {
    name: "Paper radius",
    min: 10,
    max: 5000,
    rMin: 200,
    rMax: 900,
    decimalPlaces: 0,
    default: 300,
    increment: 50,
    mode: Mode.advanced,
  },
  h: {
    name: "Frequency of paper rotation",
    min: -100,
    max: 100,
    rMin: 0,
    rMax: 0.001,
    decimalPlaces: 4,
    default: 0.0008,
    increment: 0.0001,
    mode: Mode.advanced,
  },
  w: {
    name: "Pen thickness",
    min: 0.1,
    max: 10,
    rMin: 0.1,
    rMax: 1,
    decimalPlaces: 1,
    default: 0.2,
    increment: 0.1,
    mode: Mode.advanced,
  },
  segments: {
    name: "Segments per step",
    min: 1,
    max: 40,
    rMin: 30,
    rMax: 32,
    decimalPlaces: 0,
    default: 32,
    increment: 2,
    mode: Mode.advanced,
  },
};

export function sanatizeValue(key: string, value: number): number {
  if (isNaN(value)) {
    return inputRanges[key].default;
  }

  const field = inputRanges[key];
  let newValue = Math.min(Math.max(value, field.min), field.max);

  return parseFloat(newValue.toFixed(field.decimalPlaces));
}

export function randomizeValue(key: string): number {
  const field = inputRanges[key];
  const range = field.rMax - field.rMin;
  const randomValue = Math.random() * range + field.rMin;

  return parseFloat(randomValue.toFixed(field.decimalPlaces));
}

export function randomizeInputs(
  harmonograph: Harmonograph,
  currentMode: Mode,
): Harmonograph {
  const randomized: Harmonograph = { ...harmonograph };
  const defaultValues: Harmonograph = getDefaultHarmonograph();

  for (const [key, range] of Object.entries(inputRanges)) {
    if (range.mode === currentMode || range.mode === Mode.simple) {
      const { rMin, rMax, decimalPlaces } = range;
      randomized[key as keyof Harmonograph] =
        Math.random() * (rMax - rMin) + rMin;

      const factor = Math.pow(10, decimalPlaces);
      randomized[key as keyof Harmonograph] =
        Math.round(randomized[key as keyof Harmonograph] * factor) / factor;
    } else {
      // If in simple mode, reset these values to their default value
      randomized[key as keyof Harmonograph] =
        defaultValues[key as keyof Harmonograph];
    }
  }

  return randomized;
}

export function harmonographToString(harmonograph: Harmonograph): string {
  let output = [];
  for (const [key] of Object.entries(inputRanges)) {
    output.push(`${key}=${harmonograph[key as keyof Harmonograph]}`);
  }

  return output.join(",");
}

export function stringToHarmonograph(data: string): Harmonograph | null {
  if (data.length === 0) {
    return null;
  }

  const fields = data.split(",");

  let harmonograph = getDefaultHarmonograph();

  fields.forEach((field) => {
    let values = field.split("=");

    if (values.length === 2) {
      harmonograph[values[0] as keyof Harmonograph] = Number(values[1]);
    }
  });

  return harmonograph;
}

export function getDefaultHarmonograph(): Harmonograph {
  const defaults: Harmonograph = {} as Harmonograph;
  for (const [key, range] of Object.entries(inputRanges)) {
    defaults[key as keyof Harmonograph] = range.default;
  }

  return defaults;
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

function calculateBoundingBox(pathData: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  // Only look for pathdata with numbers, this includes negatives and decimals
  const numberPattern = /-?[0-9]*\.?[0-9]+/g;
  const numbers = pathData.match(numberPattern)?.map(Number) || [];

  // Ignore if there is an empty path
  if (numbers.length < 2) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  // Find the min and max values of the path data
  for (let i = 0; i < numbers.length; i += 2) {
    const x = numbers[i];
    const y = numbers[i + 1];

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function centerAndScaleHarmonograph(
  pathData: string,
  diameter: number,
  strokeWidth: number,
): object {
  const bbox = calculateBoundingBox(pathData);

  if (bbox.width === 0 || bbox.height === 0) {
    return { d: pathData, transform: "", strokeWidth };
  }

  // Calculate the scale the harmonograph needs to fit inside the canvas
  const scaleX = diameter / bbox.width;
  const scaleY = diameter / bbox.height;
  const scale = Math.min(scaleX, scaleY, 1);

  // Calculate translation to center
  const translateX = (diameter - bbox.width * scale) / 2 - bbox.x * scale;
  const translateY = (diameter - bbox.height * scale) / 2 - bbox.y * scale;

  // Apply transformation to path, remove fill, and set stroke
  return {
    d: pathData,
    transform: `translate(${translateX}, ${translateY}) scale(${scale})`,
    strokeWidth: strokeWidth / scale,
  };
}

function getXY(harmonograph: Harmonograph, step: number) {
  var alpha =
    toRadians(harmonograph.A) *
    Math.sin(2.0 * Math.PI * (harmonograph.f * step + harmonograph.u)) *
    Math.exp(-harmonograph.R * step);
  var beta =
    toRadians(harmonograph.B) *
    Math.sin(2.0 * Math.PI * (harmonograph.g * step + harmonograph.v)) *
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

function round(x: number) {
  return Math.round(x * 1000) / 1000;
}

function toRadians(degrees: number) {
  return (degrees / 180.0) * Math.PI;
}
