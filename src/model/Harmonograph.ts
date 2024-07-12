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
  translationX: number;
  translationY: number;
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
    min: number;
    max: number;
    decimalPlaces: number;
    default: number;
    increment: number;
    mode: string;
  };
} = {
  // Simple mode params
  f: {
    min: -0.5,
    max: 0.5,
    decimalPlaces: 3,
    default: 0.3,
    increment: 0.1,
    mode: Mode.simple,
  },
  g: {
    min: -0.5,
    max: 0.5,
    decimalPlaces: 3,
    default: 0.302,
    increment: 0.1,
    mode: Mode.simple,
  },
  A: {
    min: 1,
    max: 50,
    decimalPlaces: 0,
    default: 10,
    increment: 1,
    mode: Mode.simple,
  },
  B: {
    min: 1,
    max: 50,
    decimalPlaces: 0,
    default: 10,
    increment: 1,
    mode: Mode.simple,
  },
  steps: {
    min: 0,
    max: 5000,
    decimalPlaces: 0,
    default: 900,
    increment: 100,
    mode: Mode.simple,
  },

  // Advanced mode params
  R: {
    min: 0,
    max: 0.009,
    decimalPlaces: 3,
    default: 0.001,
    increment: 0.001,
    mode: Mode.advanced,
  },
  S: {
    min: 0,
    max: 0.009,
    decimalPlaces: 3,
    default: 0.001,
    increment: 0.001,
    mode: Mode.advanced,
  },
  u: {
    min: 0,
    max: 0.2,
    decimalPlaces: 2,
    default: 0,
    increment: 0.01,
    mode: Mode.advanced,
  },
  v: {
    min: 0,
    max: 0.2,
    decimalPlaces: 2,
    default: 0,
    increment: 0.01,
    mode: Mode.advanced,
  },
  d: {
    min: 200,
    max: 1000,
    decimalPlaces: 0,
    default: 900,
    increment: 50,
    mode: Mode.advanced,
  },
  c: {
    min: 200,
    max: 1000,
    decimalPlaces: 0,
    default: 800,
    increment: 50,
    mode: Mode.advanced,
  },
  p: {
    min: 200,
    max: 1000,
    decimalPlaces: 0,
    default: 900,
    increment: 50,
    mode: Mode.advanced,
  },
  q: {
    min: 200,
    max: 1000,
    decimalPlaces: 0,
    default: 700,
    increment: 50,
    mode: Mode.advanced,
  },
  r: {
    min: 200,
    max: 900,
    decimalPlaces: 0,
    default: 300,
    increment: 50,
    mode: Mode.advanced,
  },
  h: {
    min: 0,
    max: 0.001,
    decimalPlaces: 4,
    default: 0.0008,
    increment: 0.0001,
    mode: Mode.advanced,
  },
  w: {
    min: 0.1,
    max: 1,
    decimalPlaces: 1,
    default: 0.2,
    increment: 0.1,
    mode: Mode.advanced,
  },
  segments: {
    min: 1,
    max: 50,
    decimalPlaces: 0,
    default: 32,
    increment: 1,
    mode: Mode.advanced,
  },
  translationX: {
    min: -Infinity,
    max: Infinity,
    decimalPlaces: 0,
    default: 0,
    increment: 0,
    mode: Mode.simple,
  },
  translationY: {
    min: -Infinity,
    max: Infinity,
    decimalPlaces: 0,
    default: 0,
    increment: 0,
    mode: Mode.simple,
  },
};

export function randomizeInputs(
  harmonograph: Harmonograph,
  currentMode: Mode,
): Harmonograph {
  const randomized: Harmonograph = { ...harmonograph };
  const defaultValues: Harmonograph = getDefaultHarmonograph();

  for (const [key, range] of Object.entries(inputRanges)) {
    if (range.mode === currentMode || range.mode === "both") {
      const { min, max, decimalPlaces } = range;
      randomized[key as keyof Harmonograph] = Math.random() * (max - min) + min;

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

export function getDefaultHarmonograph(): Harmonograph {
  const defaults: Harmonograph = {} as Harmonograph;
  for (const [key, range] of Object.entries(inputRanges)) {
    defaults[key as keyof Harmonograph] = range.default;
  }

  return defaults;
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
  //Only look for pathdata with numbers, this includes negatives and decimals
  const numberPattern = /-?[0-9]*\.?[0-9]+/g;
  const numbers = pathData.match(numberPattern)?.map(Number) || [];

  //If there are less than two points in the path, draw nothing, this will never happen but is still included
  if (numbers.length < 2) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  //for each point in the harmonograph path, update the min and max values
  for (let i = 0; i < numbers.length; i += 2) {
    const x = numbers[i];
    const y = numbers[i + 1];

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  //now that we found the min and maxes for both x and y, we do a simple bounding box calculation
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function centerAndScaleHarmonograph(
  pathData: string,
  canvasWidth: number,
  canvasHeight: number,
  strokeWidth: number,
): object {
  //get the bounding box of the path
  const bbox = calculateBoundingBox(pathData);

  if (bbox.width === 0 || bbox.height === 0) {
    console.warn("Invalid bounding box calculated. Using original path.");
    return { d: pathData, transform: "", strokeWidth };
  }

  // Calculate scale factor, if the bounding box of the harmonograph is larger than
  // the canvas dimensions, then the scale factor would be a decimal, e.g., 320/1000 = .32
  // we check which width of height is the limiting factor (i.e., would expand and overflow first
  // based on a scale and use the smaller of the two)
  const scaleX = canvasWidth / bbox.width;
  const scaleY = canvasHeight / bbox.height;
  const scale = Math.min(scaleX, scaleY, 1);

  // Calculate translation to center
  const translateX = (canvasWidth - bbox.width * scale) / 2 - bbox.x * scale;
  const translateY = (canvasHeight - bbox.height * scale) / 2 - bbox.y * scale;

  // Apply transformation to path, remove fill, and set stroke
  return {
    d: pathData,
    transform: `translate(${translateX}, ${translateY}) scale(${scale})`,
    strokeWidth: strokeWidth / scale,
  };
}

export type HarmonographSizeCheck = {
  overlapPercentage: {
    canvas: number;
    harmonograph: number;
  };
  computedSizes: {
    canvas: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    harmonograph: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  message?: string;
};

function round(x: number) {
  return Math.round(x * 1000) / 1000;
}

function toRadians(degrees: number) {
  return (degrees / 180.0) * Math.PI;
}
