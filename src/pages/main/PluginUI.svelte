<script>
import { GlobalCSS } from "figma-plugin-ds-svelte";

import Input from "../../components/Input/Input.svelte";
import Slider from "../../components/Slider/Slider.svelte";
import InformationHeader from "../../components/InformationHeader/InformationHeader.svelte";
import SpinMeButton from "../../components/SpinMeButton/SpinMeButton.svelte";
import { onMount, createEventDispatcher } from "svelte";

import {
  inputRanges,
  randomizeInputs,
  getDefaultInputs,
} from "../../HarmonographParams.js";

const dispatch = createEventDispatcher();

function switchToAboutPage() {
  window.parent.postMessage(
    { pluginMessage: { type: "ui-switched-to-AboutPage" } },
    "*",
  );
  dispatch("switch", 1);
}

import "./PluginUI.scss";

var currentHarmonograph;

var currentPathData = "";

var svg = "";

var selectedPanel = 0;
let activeMode = "simple";
let checkbox = false;

$: activeMode = checkbox ? "advanced" : "simple";

addEventListener("message", function handleMessage(msg) {
  console.log("got message: ", msg);
  if (msg.data.pluginMessage.type === "update-harmonograph") {
    currentHarmonograph = msg.data.pluginMessage.harmonograph;

    console.log("have harmonograph: ", msg.data);
    console.log(currentHarmonograph);

    drawHarmonographSVG(currentHarmonograph);
  }
});

function randomizeAllInputs() {
  currentHarmonograph = randomizeInputs(activeMode, currentHarmonograph);
  drawHarmonographSVG(currentHarmonograph);
}

function resetToDefaults() {
  currentHarmonograph = getDefaultInputs(activeMode);
  drawHarmonographSVG(currentHarmonograph);
  saveHarmonograph();
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "none" ? "flex" : "none";
}

onMount(() => {
  document.addEventListener("click", handleOutsideClick);
  const edge = document.getElementById("edge_bottom");

  edge.onpointerdown = (e) => {
    edge.onpointermove = resizeWindow;
    edge.setPointerCapture(e.pointerId);
  };
  edge.onpointerup = (e) => {
    edge.onpointermove = null;
    edge.releasePointerCapture(e.pointerId);
  };

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };
});

function handleOutsideClick(event) {
  const menu = document.getElementById("menu");
  const ellipsisMenu = document.querySelector(".ellipsis-menu");

  if (!ellipsisMenu.contains(event.target) && menu.style.display !== "none") {
    menu.style.display = "none";
  }
}

function openWebsite() {
  window.open("https://www.thirteen23.com/", "_blank");
}

function insertHarmonograph() {
  saveHarmonograph();

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

function saveHarmonograph() {
  parent.postMessage(
    {
      pluginMessage: {
        type: "save-harmonograph",
        harmonograph: currentHarmonograph,
        data: currentPathData,
      },
    },
    "*",
  );
}

function resizeWindow(e) {
  const height = Math.max(50, Math.floor(e.clientY + 5));
  parent.postMessage(
    { pluginMessage: { type: "resize-window", height: height } },
    "*",
  );
}

function updateHarmonograph(property, value) {
  currentHarmonograph[property] = value;
  drawHarmonographSVG(currentHarmonograph);
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
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", harmonograph.w);
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("z-index", 1);
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
  <SpinMeButton on:click="{randomizeAllInputs}" />

  <div class="preview-settings">
    <svg
      id="preview"
      xmlns="http://www.w3.org/2000/svg"
      width="320"
      height="320"
      version="1.1"></svg>
  </div>

  <div class="advanced-mode">
    <div class="advanced-mode__wrapper">
      <div class="advanced-mode__row-one">
        <div class="advanced-mode__title">ADVANCED MODE</div>
        <div class="advanced-mode__toggle">
          <label class="switch">
            <input type="checkbox" bind:checked="{checkbox}" />
            <span class="switch__toggle switch__toggle--round"></span>
          </label>
        </div>
      </div>

      <div class="advanced-mode__description">
        Harmonographs use swinging pendulums to draw pictures. In advanced mode,
        set values for the pendulums, paper, and drawing.
      </div>

      <div class="advanced-mode__panel-settings">
        <button
          type="button"
          class="{`advanced-mode__panel-button ${selectedPanel === 0 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === 'simple' ? 'advanced-mode__panel-button--disabled' : ''}`}"
          on:click="{() => {
            if (activeMode !== 'simple') {
              selectedPanel = 0;
            }
          }}">
          Pendulums
        </button>

        <button
          type="button"
          class="{`advanced-mode__panel-button ${selectedPanel === 1 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === 'simple' ? 'advanced-mode__panel-button--disabled' : ''}`}"
          on:click="{() => {
            if (activeMode !== 'simple') {
              selectedPanel = 1;
            }
          }}">
          Paper
        </button>

        <button
          type="button"
          class="{`advanced-mode__panel-button ${selectedPanel === 2 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === 'simple' ? 'advanced-mode__panel-button--disabled' : ''}`}"
          on:click="{() => {
            if (activeMode !== 'simple') {
              selectedPanel = 2;
            }
          }}">
          Drawing
        </button>
      </div>
    </div>
  </div>

  {#if currentHarmonograph !== undefined}
    <div class="options">
      <div class="options__wrapper">
        {#if activeMode === "simple"}
          <InformationHeader
            text="{'Frequency'}"
            info="{'This is how many times it moves'}" />

          <Input
            value="{currentHarmonograph.f}"
            onValueChange="{(value) => updateHarmonograph('f', value)}"
            minValue="{inputRanges.f.min}"
            maxValue="{inputRanges.f.max}"
            decimalPlaces="{inputRanges.f.decimalPlaces}"
            inputData="{'left_pendulum_frequency'}"
            unit="{'Hz'}"
            labelFieldText="{'Left pendulum frequency'}" />

          <Input
            value="{currentHarmonograph.g}"
            onValueChange="{(value) => updateHarmonograph('g', value)}"
            minValue="{inputRanges.g.min}"
            maxValue="{inputRanges.g.max}"
            decimalPlaces="{inputRanges.g.decimalPlaces}"
            inputData="{'right_pendulum_frequency'}"
            unit="{'Hz'}"
            labelFieldText="{'Right pendulum frequency'}" />

          <InformationHeader
            text="{'Amplitude'}"
            info="{'This is how many long it be'}" />

          <Input
            value="{currentHarmonograph.A}"
            onValueChange="{(value) => updateHarmonograph('A', value)}"
            minValue="{inputRanges.A.min}"
            maxValue="{inputRanges.A.max}"
            decimalPlaces="{inputRanges.A.decimalPlaces}"
            inputData="{'pendulum_left_amplitude'}"
            unit="{'degrees'}"
            labelFieldText="{'Pendulum left amplitude'}" />

          <Input
            value="{currentHarmonograph.B}"
            onValueChange="{(value) => updateHarmonograph('B', value)}"
            minValue="{inputRanges.B.min}"
            maxValue="{inputRanges.B.max}"
            decimalPlaces="{inputRanges.B.decimalPlaces}"
            inputData="{'pendulum_right_amplitude'}"
            unit="{'degrees'}"
            labelFieldText="{'Pendulum right amplitude'}" />

          <InformationHeader
            text="{'Steps'}"
            info="{'This is how many times it steps'}" />

          <Slider
            min="{0}"
            max="{5000}"
            value="{currentHarmonograph.steps}"
            onValueChange="{(value) => updateHarmonograph('steps', value)}" />
        {:else}
          <div class="{`harmono-panel${selectedPanel === 0 ? '' : ' hidden'}`}">
            <InformationHeader
              text="{'Frequency'}"
              info="{'This is how many times it moves'}" />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.f}"
                onValueChange="{(value) => updateHarmonograph('f', value)}"
                minValue="{inputRanges.f.min}"
                maxValue="{inputRanges.f.max}"
                decimalPlaces="{inputRanges.f.decimalPlaces}"
                inputData="{'left_pendulum_frequency'}"
                hideRandomizeButton="{true}"
                unit="{'Hz'}"
                labelFieldText="{'Left pendulum frequency'}" />

              <Input
                value="{currentHarmonograph.g}"
                onValueChange="{(value) => updateHarmonograph('g', value)}"
                minValue="{inputRanges.g.min}"
                maxValue="{inputRanges.g.max}"
                decimalPlaces="{inputRanges.g.decimalPlaces}"
                inputData="{'right_pendulum_frequency'}"
                hideRandomizeButton="{true}"
                unit="{'Hz'}"
                labelFieldText="{'Right pendulum frequency'}" />
            </div>

            <InformationHeader
              text="{'Amplitude'}"
              info="{'This is how many long it be'}" />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.A}"
                onValueChange="{(value) => updateHarmonograph('A', value)}"
                minValue="{inputRanges.A.min}"
                maxValue="{inputRanges.A.max}"
                decimalPlaces="{inputRanges.A.decimalPlaces}"
                inputData="{'pendulum_left_amplitude'}"
                hideRandomizeButton="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Pendulum left amplitude'}" />

              <Input
                value="{currentHarmonograph.B}"
                onValueChange="{(value) => updateHarmonograph('B', value)}"
                minValue="{inputRanges.B.min}"
                maxValue="{inputRanges.B.max}"
                decimalPlaces="{inputRanges.B.decimalPlaces}"
                inputData="{'pendulum_right_amplitude'}"
                hideRandomizeButton="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Pendulum right amplitude'}" />
            </div>

            <InformationHeader
              text="{'Damping'}"
              info="{'This is how damping'}" />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.R}"
                onValueChange="{(value) => updateHarmonograph('R', value)}"
                minValue="{inputRanges.R.min}"
                maxValue="{inputRanges.R.max}"
                decimalPlaces="{inputRanges.R.decimalPlaces}"
                inputData="{'left_pendulum_damping'}"
                hideRandomizeButton="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Left pendulum'}" />

              <Input
                value="{currentHarmonograph.S}"
                onValueChange="{(value) => updateHarmonograph('S', value)}"
                minValue="{inputRanges.S.min}"
                maxValue="{inputRanges.S.max}"
                decimalPlaces="{inputRanges.S.decimalPlaces}"
                inputData="{'right_pendulum_damping'}"
                hideRandomizeButton="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Right pendulum'}" />
            </div>

            <InformationHeader
              text="{'Phase'}"
              info="{'This is how phasing bro'}" />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.u}"
                onValueChange="{(value) => updateHarmonograph('u', value)}"
                minValue="{inputRanges.u.min}"
                maxValue="{inputRanges.u.max}"
                decimalPlaces="{inputRanges.u.decimalPlaces}"
                inputData="{'left_pendulum_phase'}"
                hideRandomizeButton="{true}"
                hideUnits="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Left pendulum'}" />

              <Input
                value="{currentHarmonograph.v}"
                onValueChange="{(value) => updateHarmonograph('v', value)}"
                minValue="{inputRanges.v.min}"
                maxValue="{inputRanges.v.max}"
                decimalPlaces="{inputRanges.v.decimalPlaces}"
                inputData="{'right_pendulum_phase'}"
                hideRandomizeButton="{true}"
                hideUnits="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Right pendulum'}" />
            </div>

            <InformationHeader
              text="{'Distance between pendulums'}"
              info="{'This is how distance bro'}" />

            <Input
              value="{currentHarmonograph.d}"
              onValueChange="{(value) => updateHarmonograph('d', value)}"
              minValue="{inputRanges.d.min}"
              maxValue="{inputRanges.d.max}"
              decimalPlaces="{inputRanges.d.decimalPlaces}"
              inputData="{'distance_between_pendulums'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Distance'}" />
          </div>

          <div class="{`harmono-panel${selectedPanel === 1 ? '' : ' hidden'}`}">
            <InformationHeader
              text="{'Paper Center'}"
              info="{'This is how paper center bro'}" />

            <Input
              value="{currentHarmonograph.c}"
              onValueChange="{(value) => updateHarmonograph('c', value)}"
              minValue="{inputRanges.c.min}"
              maxValue="{inputRanges.c.max}"
              decimalPlaces="{inputRanges.c.decimalPlaces}"
              inputData="{'paper_center'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Location'}" />

            <InformationHeader
              text="{'Length of pen arm'}"
              info="{'This is how paper length bro'}" />

            <Input
              value="{currentHarmonograph.p}"
              onValueChange="{(value) => updateHarmonograph('p', value)}"
              minValue="{inputRanges.p.min}"
              maxValue="{inputRanges.p.max}"
              decimalPlaces="{inputRanges.p.decimalPlaces}"
              inputData="{'length_of_pen_arm'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Length'}" />

            <InformationHeader
              text="{'Position of pen arm'}"
              info="{'This is how position pen bro'}" />

            <Input
              value="{currentHarmonograph.q}"
              onValueChange="{(value) => updateHarmonograph('q', value)}"
              minValue="{inputRanges.q.min}"
              maxValue="{inputRanges.q.max}"
              decimalPlaces="{inputRanges.q.decimalPlaces}"
              inputData="{'position_of_pen_arm'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Position'}" />

            <InformationHeader
              text="{'Paper Radius'}"
              info="{'This is how paper radius bro'}" />

            <Input
              value="{currentHarmonograph.r}"
              onValueChange="{(value) => updateHarmonograph('r', value)}"
              minValue="{inputRanges.r.min}"
              maxValue="{inputRanges.r.max}"
              decimalPlaces="{inputRanges.r.decimalPlaces}"
              inputData="{'paper_radius'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              unit="{'degrees'}"
              labelFieldText="{'Length'}" />

            <InformationHeader
              text="{'Frequency of paper rotation'}"
              info="{'This is how paper rotaion frequency bro'}" />

            <Input
              value="{currentHarmonograph.h}"
              onValueChange="{(value) => updateHarmonograph('h', value)}"
              minValue="{inputRanges.h.min}"
              maxValue="{inputRanges.h.max}"
              decimalPlaces="{inputRanges.h.decimalPlaces}"
              inputData="{'frequency_of_paper_rotation'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              unit="{'degrees'}"
              labelFieldText="{'Frequency'}" />

            <InformationHeader
              text="{'Pen thickness (stroke)'}"
              info="{'This is how pen thickness bro'}" />

            <Input
              value="{currentHarmonograph.w}"
              onValueChange="{(value) => updateHarmonograph('w', value)}"
              minValue="{inputRanges.w.min}"
              maxValue="{inputRanges.w.max}"
              decimalPlaces="{inputRanges.w.decimalPlaces}"
              inputData="{'pen_thickness'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              unit="{'degrees'}"
              labelFieldText="{'Thickness'}" />
          </div>

          <div class="{`harmono-panel${selectedPanel === 2 ? '' : ' hidden'}`}">
            <InformationHeader
              text="{'Steps'}"
              info="{'This is how many times it steps'}" />

            <Slider
              value="{currentHarmonograph.steps}"
              min="{0}"
              max="{5000}"
              onValueChange="{(value) => updateHarmonograph('steps', value)}" />

            <InformationHeader
              text="{'Segments per Step'}"
              info="{'This is how segments bro'}" />

            <Slider
              value="{currentHarmonograph.segments}"
              min="{1}"
              max="{50}"
              onValueChange="{(value) =>
                updateHarmonograph('segments', value)}" />
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <footer class="footer">
    <div class="footer__content">
      <button
        class="footer__button footer__button--primary"
        on:click="{insertHarmonograph}">
        Add to canvas
      </button>
      <div class="ellipsis-menu" aria-label="More options">
        <div
          class="ellipsis-menu__dots"
          on:click|stopPropagation="{toggleMenu}">
          <span class="ellipsis-menu__dot"></span>
          <span class="ellipsis-menu__dot"></span>
          <span class="ellipsis-menu__dot"></span>
        </div>

        <div id="menu" class="ellipsis-menu__dropdown" style="display: none;">
          <button
            class="ellipsis-menu__option"
            on:click="{() => {
              resetToDefaults();
              toggleMenu();
            }}">Reset params</button>
          <div class="ellipsis-menu__divider"></div>
          <button
            class="ellipsis-menu__option"
            on:click="{() => {
              switchToAboutPage();
              toggleMenu();
            }}">About this plugin</button>
          <div class="ellipsis-menu__divider"></div>
          <button
            class="ellipsis-menu__option"
            on:click="{() => {
              openWebsite();
              toggleMenu();
            }}">@thirteen23</button>
        </div>
      </div>
    </div>
  </footer>
  <div id="edge_bottom"></div>
</div>
