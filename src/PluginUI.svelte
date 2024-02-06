<style>
.wrapper {
  padding-top: 370px;
  /* padding-left: 15px; */
}

.preview-settings {
  position: fixed;
  z-index: 100;
  display: flex;
  flex-direction: column;
  top: 0;
  background-color: var(--figma-color-bg);
}

#preview {
  margin-top: 10px;
  top: 15px;
  background-color: var(--figma-color-bg);
  border: solid 1px var(--figma-color-border);
  border-radius: 5px;
}

.harmono-panel-settings {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
  margin-top: 10px;
  font-size: 12px;
  border: 1px solid var(--figma-color-border-brand);
  border-radius: 15px;
  color: var(--figma-color-bg);
}

.harmono-panel-settings > input {
  display: none;
}

.harmono-panel-settings > label {
  display: block;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  background-color: var(--figma-color-bg);
  color: var(--figma-color-text);
  border: 1px solid var(--figma-color-bg);
  border-radius: 3px;
  transition: background-color 0.3s;
}

.harmono-panel-settings > input:checked + label {
  color: var(--figma-color-text-onbrand);
  background-color: var(--figma-color-border-oncomponent);
  border: 1px solid var(--figma-color-border-oncomponent);
}

.harmono-panel-settings label:before {
  background: var(--figma-color-bg);
  transition: all 250ms cubic-bezier(0, 0.95, 0.38, 0.98);
}

.harmono-panel-settings label {
  border-radius: 15px;

  flex: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  background-color: var(--figma-color-bg);
}

.harmono-panel-settings > label:hover {
  color: var(--figma-color-text-hover);
  background-color: var(--figma-color-bg);
  border: 1px solid var(--figma-color-border-component-hover);
}

.harmono-panel-settings > input:checked + label:hover {
  color: var(--figma-color-text-hover);
  border: 1px solid var(--figma-color-border-selected-strong);
}

.harmono-panel-settings label {
  padding: 6px 3px;
  transition: color 250ms cubic-bezier(0, 0.95, 0.38, 0.98);
}

.harmono-panel-settings
  > input:nth-of-type(3):checked
  ~ label:last-of-type:before {
  transform: translateX(calc(100% + 0px));
}

/* Add additional global or scoped styles here */
</style>

<script>
import { GlobalCSS } from "figma-plugin-ds-svelte";
import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";

var disabled = true;

var currentHarmonograph;

// var d = 900;
// var c = 800;
// var p = 900;
// var q = 700;
// var r = 300;
// var A = 10; // convert toRadians
// var B = 10; // convert toRadians
// var u = 0;
// var v = 0;
// var R = 0.001;
// var S = 0.001;
// var f = 0.3;
// var g = 0.302;
// var h = 0.0008;
// var w = 0.2;

var currentPathData = "";

// var diameter = 320;
// var steps = 900;
// var segments = 32;

var svg = "";

var selectedPaenel = 0;

$: disabled = false; // isNaN(d) || isNaN(c) || isNaN(p) || isNaN(q) || isNaN(r) || isNaN(A) || isNaN(B) || isNaN(u) || isNaN(v) || isNaN(R) || isNaN(S) || isNaN(f) || isNaN(g) || isNaN(h) || isNaN(w);

addEventListener("message", function handleMessage(msg) {
  console.log("got message: ", msg);
  if (msg.data.pluginMessage.type === "update-harmonograph") {
    currentHarmonograph = msg.data.pluginMessage.harmonograph;

    console.log("have harmonograph: ", msg.data);

    drawHarmonographSVG(currentHarmonograph);
  }
});

function insertHarmonograph() {
  parent.postMessage(
    {
      pluginMessage: {
        type: "insert-harmonograph",
        harmonograph: currentHarmonograph,
        data: currentPathData,
      },
    },
    "*",
  );
}

function drawHarmonographSVG(harmonograph) {
  var data = createPathData(harmonograph);

  svg = document.getElementById("preview");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${harmonograph.r} ${harmonograph.r}`);
  var width = harmonograph.r;
  var height = harmonograph.r;

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", harmonograph.w);
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute(
    "transform",
    `scale(0.5, 0.5) translate(${width}, ${height})`,
  );

  currentPathData = data.join(" ");
  path.setAttribute("d", data.join(" "));

  svg.appendChild(path);
}

function getXY(harmonograph, step) {
  var alpha =
    toRadians(harmonograph.A) *
    Math.sin(
      2.0 * Math.PI * (harmonograph.f * step + parseFloat(harmonograph.u)),
    ) *
    Math.exp(-harmonograph.R * step);
  var beta =
    toRadians(harmonograph.B) *
    Math.sin(
      2.0 * Math.PI * (harmonograph.g * step + parseFloat(harmonograph.v)),
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

function createPathData(harmonograph) {
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

  return data;
}

// Could possibly be replaced by the built in rounding function
function round(x) {
  return Math.round(x * 1000) / 1000;
}

function toRadians(degrees) {
  return (degrees / 180.0) * Math.PI;
}

function cancel() {
  parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
}
</script>

<div class="wrapper p-xxsmall">
  <div class="preview-settings">
    <svg
      id="preview"
      xmlns="http://www.w3.org/2000/svg"
      width="320"
      height="320"
      version="1.1"
    ></svg>

    <div class="{`harmono-panel-settings`}">
      <input
        type="radio"
        name="setting-type"
        value="pendulums"
        id="pendulums"
        on:click="{() => {
          selectedPaenel = 0;
        }}"
        checked
      />
      <label for="pendulums"> Pendulums </label>

      <input
        type="radio"
        name="setting-type"
        value="paper"
        id="paper"
        on:click="{() => {
          selectedPaenel = 1;
        }}"
      />
      <label for="paper"> Paper </label>

      <input
        type="radio"
        name="setting-type"
        value="drawing"
        id="drawing"
        on:click="{() => {
          selectedPaenel = 2;
        }}"
      />
      <label for="drawing"> Drawing </label>
    </div>
  </div>
  {#if currentHarmonograph !== undefined}
    <div class="{`harmono-panel${selectedPaenel === 0 ? '' : ' hidden'}`}">
      <Label>Left pendulum frequency</Label>
      <Input
        iconText="Hz"
        bind:value="{currentHarmonograph.f}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Right pendulum frequency</Label>
      <Input
        iconText="Hz"
        bind:value="{currentHarmonograph.g}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Pendulum left amplitude</Label>
      <Input
        iconText="°"
        bind:value="{currentHarmonograph.A}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Pendulum right amplitude</Label>
      <Input
        iconText="°"
        bind:value="{currentHarmonograph.B}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Distance between pendulums</Label>
      <Input
        iconText="mm"
        bind:value="{currentHarmonograph.d}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Left pendulum phase</Label>
      <Input
        bind:value="{currentHarmonograph.u}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Right pendulum phase</Label>
      <Input
        bind:value="{currentHarmonograph.v}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Left pendulum damping</Label>
      <Input
        bind:value="{currentHarmonograph.R}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Right pendulum damping</Label>
      <Input
        bind:value="{currentHarmonograph.S}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />
    </div>

    <div class="{`harmono-panel${selectedPaenel === 1 ? '' : ' hidden'}`}">
      <Label>Paper Center</Label>
      <Input
        iconText="mm"
        bind:value="{currentHarmonograph.c}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Length of pen arm</Label>
      <Input
        iconText="mm"
        bind:value="{currentHarmonograph.p}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Position of pen arm</Label>
      <Input
        iconText="mm"
        bind:value="{currentHarmonograph.q}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Paper Radius</Label>
      <Input
        iconText="mm"
        bind:value="{currentHarmonograph.r}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Frequency of paper rotation</Label>
      <Input
        iconText="Hz"
        bind:value="{currentHarmonograph.h}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Pen thickness (stroke)</Label>
      <Input
        iconText="mm"
        bind:value="{currentHarmonograph.w}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />
    </div>

    <div class="{`harmono-panel${selectedPaenel === 2 ? '' : ' hidden'}`}">
      <Label>Steps</Label>
      <Input
        iconText="#"
        bind:value="{currentHarmonograph.steps}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        class="mb-xxsmall"
      />

      <Label>Segments per Step</Label>
      <Input
        iconText="#"
        bind:value="{currentHarmonograph.segments}"
        on:change="{() => drawHarmonographSVG(currentHarmonograph)}"
        on:key
        class="mb-xxsmall"
      />
    </div>

    <Button on:click="{insertHarmonograph}" bind:disabled="{disabled}"
      >Create harmonograph</Button
    >
  {/if}
</div>
