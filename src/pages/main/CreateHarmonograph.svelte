<script>
import { GlobalCSS } from "figma-plugin-ds-svelte";

import { onMount } from "svelte";
import { draw, fade } from "svelte/transition";
import { quintOut } from "svelte/easing";

import Input from "../../components/Input/Input.svelte";
import Slider from "../../components/Slider/Slider.svelte";
import InformationHeader from "../../components/InformationHeader/InformationHeader.svelte";
import SpinMeButton from "../../components/SpinMeButton/SpinMeButton.svelte";
import Footer from "../../components/Footer/Footer.svelte";

import {
  inputRanges,
  randomizeInputs,
  getDefaultHarmonograph,
  createSVGPathData,
  Mode,
  tooltips,
  centerAndScaleHarmonograph,
} from "../../model/Harmonograph";
import { PluginMessages } from "../../model/Messages";

import "./CreateHarmonograph.scss";

export let openWebsite = () => console.log("not implemented!");
export let navigateToAbout = () => console.log("not implemented!");
export let loadHarmonograph = () => console.log("not implemented!");

export let loadedHarmonograph = undefined;
let currentHarmonograph = getDefaultHarmonograph();

$: {
  currentHarmonograph = loadedHarmonograph;
  renderCurrentHarmonograph();
}

let svgRef;

var selectedPanel = 0;

export let advancedMode = false;

$: activeMode = advancedMode ? Mode.advanced : Mode.simple;
let svgPath = "";

function randomizeAllInputs() {
  currentHarmonograph = randomizeInputs(currentHarmonograph, activeMode);
  renderCurrentHarmonograph(true);
}

function resetToDefaults() {
  currentHarmonograph = getDefaultHarmonograph(activeMode);
  renderCurrentHarmonograph();
  saveHarmonograph();
}

onMount(() => {
  renderCurrentHarmonograph();

  document.addEventListener("click", handleOutsideClick);

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

const insertHarmonograph = () => {
  saveHarmonograph();

  const svgElement = document.getElementById("preview");
  const svgContent = svgElement.outerHTML;

  parent.postMessage(
    {
      pluginMessage: {
        type: PluginMessages.insertHarmonograph,
        harmonograph: currentHarmonograph,
        svgContent: svgContent,
      },
    },
    "*",
  );
};

const saveHarmonograph = () => {
  parent.postMessage(
    {
      pluginMessage: {
        type: PluginMessages.saveHarmonograph,
        harmonograph: currentHarmonograph,
      },
    },
    "*",
  );
};

const updateAdvancedMode = () => {
  parent.postMessage(
    {
      pluginMessage: {
        type: PluginMessages.updateAdvancedMode,
        advancedMode,
      },
    },
    "*",
  );
};

let renderPath = true;
let diameter = 320;
let stroke_width = 0.2;
let pathAttributes = { d: "", transform: "", strokeWidth: 0 };

function renderCurrentHarmonograph(animate = true) {
  if (animate) {
    renderPath = false;

    setTimeout(() => {
      drawHarmonographPath();

      setTimeout(() => {
        renderPath = true;
      }, 50);
    }, 300);
  } else {
    drawHarmonographPath();
  }
}

function drawHarmonographPath() {
  stroke_width = currentHarmonograph.w;
  svgRef.setAttribute("preserveAspectRatio", "xMidYMid meet");
  diameter = Math.floor(currentHarmonograph.r * 2);
  svgRef.setAttribute("viewBox", `0 0 ${diameter} ${diameter}`);
  svgPath = createSVGPathData(currentHarmonograph);

  pathAttributes = centerAndScaleHarmonograph(svgPath, diameter, stroke_width);
}

function updateHarmonograph(property, value, animated = true) {
  currentHarmonograph[property] = value;
  renderCurrentHarmonograph(animated);
}
</script>

<div class="wrapper">
  <SpinMeButton on:click="{randomizeAllInputs}" />

  <div
    class="preview-settings"
    style="--stroke_width: {stroke_width}px;--diameter: {diameter}px"
  >
    <svg
      id="preview"
      bind:this="{svgRef}"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      {#if renderPath}
        <path
          in:draw="{{
            duration: Math.min(currentHarmonograph.steps, 3000),
            easing: quintOut,
          }}"
          out:fade="{{
            duration: 300,
          }}"
          d="{pathAttributes.d}"
          transform="{pathAttributes.transform}"
          fill="none"
          stroke="currentColor"
          stroke-width="{pathAttributes.strokeWidth}"
        ></path>
      {/if}
    </svg>
  </div>

  <div class="advanced-mode">
    <div class="advanced-mode__wrapper">
      <div class="advanced-mode__row-one">
        <div class="advanced-mode__title">ADVANCED MODE</div>
        <label class="switch">
          <input
            type="checkbox"
            bind:checked="{advancedMode}"
            on:change="{updateAdvancedMode}"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="52"
            height="28"
            viewBox="0 0 52 28"
            fill="none"
          >
            <rect
              class="switch__background"
              x="1"
              y="1"
              width="48"
              height="24"
              rx="12"
            ></rect>
            <circle class="switch__foreground" cx="13" cy="13" r="12"></circle>
          </svg>
        </label>
      </div>

      <div class="advanced-mode__description">
        Harmonographs use swinging pendulums to draw pictures. In advanced mode,
        set values for the pendulums, paper, and drawing.
      </div>

      {#if activeMode === Mode.advanced}
        <div class="advanced-mode__panel-settings">
          <button
            type="button"
            class="{`advanced-mode__panel-button ${selectedPanel === 0 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === Mode.simple ? 'advanced-mode__panel-button--disabled' : ''}`}"
            on:click="{() => {
              if (activeMode === Mode.advanced) {
                selectedPanel = 0;
              }
            }}"
          >
            Pendulums
          </button>

          <button
            type="button"
            class="{`advanced-mode__panel-button ${selectedPanel === 1 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === Mode.simple ? 'advanced-mode__panel-button--disabled' : ''}`}"
            on:click="{() => {
              if (activeMode === Mode.advanced) {
                selectedPanel = 1;
              }
            }}"
          >
            Paper
          </button>

          <button
            type="button"
            class="{`advanced-mode__panel-button ${selectedPanel === 2 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === Mode.simple ? 'advanced-mode__panel-button--disabled' : ''}`}"
            on:click="{() => {
              if (activeMode === Mode.advanced) {
                selectedPanel = 2;
              }
            }}"
          >
            Drawing
          </button>
        </div>
      {/if}
    </div>
  </div>

  {#if currentHarmonograph !== undefined}
    <div class="options">
      <div class="options__wrapper">
        <div class="harmono-panel">
          {#if activeMode === Mode.simple || selectedPanel === 0}
            <InformationHeader
              text="{tooltips.frequency.header}"
              info="{tooltips.frequency.tooltip}"
            />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.f}"
                field="f"
                onValueChange="{updateHarmonograph}"
                inputData="{'left_pendulum_frequency'}"
                unit="{'Hz'}"
                labelFieldText="{'Left pendulum'}"
                increment="{inputRanges.f.increment}"
              />

              <Input
                value="{currentHarmonograph.g}"
                field="g"
                onValueChange="{updateHarmonograph}"
                inputData="{'right_pendulum_frequency'}"
                unit="{'Hz'}"
                labelFieldText="{'Right pendulum'}"
                increment="{inputRanges.g.increment}"
              />
            </div>
          {/if}

          {#if activeMode === Mode.simple || selectedPanel === 0}
            <InformationHeader
              text="{tooltips.amplitude.header}"
              info="{tooltips.amplitude.tooltip}"
            />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.A}"
                field="A"
                onValueChange="{updateHarmonograph}"
                inputData="{'pendulum_left_amplitude'}"
                unit="{'degrees'}"
                labelFieldText="{'Left pendulum'}"
                increment="{inputRanges.A.increment}"
              />

              <Input
                value="{currentHarmonograph.B}"
                field="B"
                onValueChange="{updateHarmonograph}"
                inputData="{'pendulum_right_amplitude'}"
                unit="{'degrees'}"
                labelFieldText="{'Right pendulum'}"
                increment="{inputRanges.B.increment}"
              />
            </div>
          {/if}

          {#if activeMode === Mode.advanced && selectedPanel === 0}
            <InformationHeader
              text="{tooltips.damping.header}"
              info="{tooltips.damping.tooltip}"
            />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.R}"
                field="R"
                onValueChange="{updateHarmonograph}"
                inputData="{'left_pendulum_damping'}"
                labelFieldText="{'Left pendulum'}"
                increment="{inputRanges.R.increment}"
              />

              <Input
                value="{currentHarmonograph.S}"
                field="S"
                onValueChange="{updateHarmonograph}"
                inputData="{'right_pendulum_damping'}"
                labelFieldText="{'Right pendulum'}"
                increment="{inputRanges.S.increment}"
              />
            </div>

            <InformationHeader
              text="{tooltips.phase.header}"
              info="{tooltips.phase.tooltip}"
            />

            <div class="two-col-layout">
              <Input
                value="{currentHarmonograph.u}"
                field="u"
                onValueChange="{updateHarmonograph}"
                inputData="{'left_pendulum_phase'}"
                hideUnits="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Left pendulum'}"
                increment="{inputRanges.u.increment}"
              />

              <Input
                value="{currentHarmonograph.v}"
                field="v"
                onValueChange="{updateHarmonograph}"
                inputData="{'right_pendulum_phase'}"
                hideUnits="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Right pendulum'}"
                increment="{inputRanges.v.increment}"
              />
            </div>

            <InformationHeader
              text="{tooltips.pendulumDistance.header}"
              info="{tooltips.pendulumDistance.tooltip}"
            />

            <Input
              value="{currentHarmonograph.d}"
              field="d"
              onValueChange="{updateHarmonograph}"
              inputData="{'distance_between_pendulums'}"
              hideUnits="{true}"
              increment="{inputRanges.d.increment}"
            />
          {/if}

          {#if activeMode === Mode.advanced && selectedPanel === 1}
            <InformationHeader
              text="{tooltips.paperCenter.header}"
              info="{tooltips.paperCenter.tooltip}"
            />

            <Input
              value="{currentHarmonograph.c}"
              field="c"
              onValueChange="{updateHarmonograph}"
              inputData="{'paper_center'}"
              hideUnits="{true}"
              increment="{inputRanges.c.increment}"
            />

            <InformationHeader
              text="{tooltips.paperRadius.header}"
              info="{tooltips.paperRadius.tooltip}"
            />

            <Input
              value="{currentHarmonograph.r}"
              field="r"
              onValueChange="{updateHarmonograph}"
              inputData="{'paper_radius'}"
              hideUnits="{true}"
              unit="{'degrees'}"
              increment="{inputRanges.r.increment}"
            />

            <InformationHeader
              text="{tooltips.paperFrequency.header}"
              info="{tooltips.paperFrequency.tooltip}"
            />

            <Input
              value="{currentHarmonograph.h}"
              field="h"
              onValueChange="{updateHarmonograph}"
              inputData="{'frequency_of_paper_rotation'}"
              hideUnits="{true}"
              unit="{'Hz'}"
              increment="{inputRanges.h.increment}"
            />
          {/if}

          {#if activeMode === Mode.advanced && selectedPanel === 2}
            <InformationHeader
              text="{tooltips.penArmLength.header}"
              info="{tooltips.penArmLength.tooltip}"
            />

            <Input
              value="{currentHarmonograph.p}"
              field="p"
              onValueChange="{updateHarmonograph}"
              inputData="{'length_of_pen_arm'}"
              hideUnits="{true}"
              increment="{inputRanges.p.increment}"
            />

            <InformationHeader
              text="{tooltips.penArmPosition.header}"
              info="{tooltips.penArmPosition.tooltip}"
            />

            <Input
              value="{currentHarmonograph.q}"
              field="q"
              onValueChange="{updateHarmonograph}"
              inputData="{'position_of_pen_arm'}"
              hideUnits="{true}"
              increment="{inputRanges.q.increment}"
            />

            <InformationHeader
              text="{tooltips.penThickness.header}"
              info="{tooltips.penThickness.tooltip}"
            />

            <Input
              value="{currentHarmonograph.w}"
              field="w"
              onValueChange="{updateHarmonograph}"
              inputData="{'pen_thickness'}"
              hideUnits="{true}"
              unit="{'degrees'}"
              increment="{inputRanges.w.increment}"
            />
          {/if}

          {#if activeMode === Mode.simple || selectedPanel === 2}
            <InformationHeader
              text="{tooltips.steps.header}"
              info="{tooltips.steps.tooltip}"
            />

            <Slider
              field="steps"
              min="{inputRanges.steps.min}"
              max="{inputRanges.steps.max}"
              onValueChange="{updateHarmonograph}"
              value="{currentHarmonograph.steps}"
              increment="{inputRanges.steps.increment}"
            />
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <Footer
    primaryButton="{{
      fullWidth: false,
      text: 'Add to canvas',
      action: insertHarmonograph,
    }}"
    onResetClicked="{resetToDefaults}"
    options="{[
      {
        text: 'Load from selection',
        action: loadHarmonograph,
      },
      {
        text: 'About this plugin',
        action: navigateToAbout,
      },
      {
        text: '@thirteen23',
        action: openWebsite,
      },
    ]}"
  />
</div>
