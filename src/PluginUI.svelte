<style>
.wrapper {
  padding-top: 335px;
  /* padding-left: 15px; */
}

#preview {
  top: 15px;
  position: fixed;
  background-color: var(--figma-color-bg);
  z-index: 100;
  border: solid 1px var(--figma-color-border);
  border-radius: 5px;
}

.harmono-panel-settings {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
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
  color: #000;
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

//import Global CSS from the svelte boilerplate
//contains Figma color vars, spacing vars, utility classes and more

//import some Svelte Figma UI components

var disabled = true;

var d = 900;
var c = 800;
var p = 900;
var q = 700;
var r = 300;
var A = 10; // convert toRadians
var B = 10; // convert toRadians
var u = 0;
var v = 0;
var R = 0.001;
var S = 0.001;
var f = 0.3;
var g = 0.302;
var h = 0.0008;
var w = 0.2;

var scale = 1;
var pathData = "";

var diameter = 320;
var steps = 320;
var segments = 32;

var svg = "";

var selectedPaenel = 0;

$: disabled = false; // isNaN(d) || isNaN(c) || isNaN(p) || isNaN(q) || isNaN(r) || isNaN(A) || isNaN(B) || isNaN(u) || isNaN(v) || isNaN(R) || isNaN(S) || isNaN(f) || isNaN(g) || isNaN(h) || isNaN(w);

function createHarmonograph() {
  parent.postMessage(
    {
      pluginMessage: {
        type: "create-harmonograph",
        height: r,
        width: r,
        scale: scale,
        stroke: w,
        data: pathData,
      },
    },
    "*",
  );
}

function drawHarmonographSVG() {
  var data = createPathData();

  svg = document.getElementById("preview");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${r} ${r}`);
  var width = r;
  var height = r;

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", w);
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute(
    "transform",
    `scale(0.5, 0.5) translate(${width}, ${height})`,
  );

  pathData = data.join(" ");
  path.setAttribute("d", data.join(" "));

  svg.appendChild(path);
}

function getXY(t) {
  var alpha =
    toRadians(A) *
    Math.sin(2.0 * Math.PI * (f * t + parseFloat(u))) *
    Math.exp(-R * t);
  var beta =
    toRadians(B) *
    Math.sin(2.0 * Math.PI * (g * t + parseFloat(v))) *
    Math.exp(-S * t);
  var gamma = 2.0 * Math.PI * h * t;

  var xa = p * Math.cos(alpha) + q * Math.sin(alpha) - d;
  var ya = q * Math.cos(alpha) - p * Math.sin(alpha);
  var xb = xa * Math.cos(beta) - ya * Math.sin(beta);
  var yb = ya * Math.cos(beta) + xa * Math.sin(beta) - c;
  var x = xb * Math.cos(gamma) - yb * Math.sin(gamma);
  var y = yb * Math.cos(gamma) + xb * Math.sin(gamma);

  console.log("time: ", t, " x: ", x, " y: ", y);

  return { x: x, y: y };
}

function createPathData() {
  var startCoords = getXY(0);
  console.log("start coords: ", startCoords);
  var xs = [startCoords.x];
  var ys = [startCoords.y];

  var t = 0;

  for (var i = 0; i < steps; ++i) {
    for (var j = 0; j < segments; ++j) {
      t += 0.1;
      var coords = getXY(t);
      xs.push(coords.x);
      ys.push(coords.y);
    }
  }

  var n = xs.length;
  var factor = 0.5 / 3;
  var rxs = [];
  var rys = [];
  var cxs = [];
  var cys = [];

  for (var i = 0; i < n; i += 1) {
    var prev = Math.max(0, i - 1);
    var next = Math.min(n - 1, i + 1);
    rxs.push(xs[i]);
    rys.push(ys[i]);
    cxs.push(factor * (xs[next] - xs[prev]));
    cys.push(factor * (ys[next] - ys[prev]));
  }

  var rn = rxs.length;

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
        console.log(selectedPaenel);
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
        console.log(selectedPaenel);
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
        console.log(selectedPaenel);
      }}"
    />
    <label for="drawing"> Drawing </label>
  </div>

  <div class="{`harmono-panel${selectedPaenel === 0 ? '' : ' hidden'}`}">
    <Label>Left pendulum frequency</Label>
    <Input
      iconText="Hz"
      bind:value="{f}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Right pendulum frequency</Label>
    <Input
      iconText="Hz"
      bind:value="{g}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Pendulum left amplitude</Label>
    <Input
      iconText="°"
      bind:value="{A}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Pendulum right amplitude</Label>
    <Input
      iconText="°"
      bind:value="{B}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Distance between pendulums</Label>
    <Input
      iconText="mm"
      bind:value="{d}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Left pendulum phase</Label>
    <Input
      bind:value="{u}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Right pendulum phase</Label>
    <Input
      bind:value="{v}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Left pendulum damping</Label>
    <Input
      bind:value="{R}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Right pendulum damping</Label>
    <Input
      bind:value="{S}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />
  </div>

  <div class="{`harmono-panel${selectedPaenel === 1 ? '' : ' hidden'}`}">
    <Label>Paper Center</Label>
    <Input
      iconText="mm"
      bind:value="{c}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Length of pen arm</Label>
    <Input
      iconText="mm"
      bind:value="{p}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Position of pen arm</Label>
    <Input
      iconText="mm"
      bind:value="{q}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Paper Radius</Label>
    <Input
      iconText="mm"
      bind:value="{r}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Frequency of paper rotation</Label>
    <Input
      iconText="Hz"
      bind:value="{h}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Pen thickness (stroke)</Label>
    <Input
      iconText="mm"
      bind:value="{w}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />
  </div>

  <div class="{`harmono-panel${selectedPaenel === 2 ? '' : ' hidden'}`}">
    <Label>Steps</Label>
    <Input
      iconText="#"
      bind:value="{steps}"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Segments per Step</Label>
    <Input
      iconText="#"
      bind:value="{segments}"
      on:change="{() => drawHarmonographSVG()}"
      on:key
      class="mb-xxsmall"
    />
  </div>

  <Button on:click="{createHarmonograph}" bind:disabled="{disabled}"
    >Create harmonograph</Button
  >
</div>
