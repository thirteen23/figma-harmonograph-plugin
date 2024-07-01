<script>
import { GlobalCSS } from "figma-plugin-ds-svelte";

import { onMount } from "svelte";
import { draw, fade } from "svelte/transition";
import { quintOut } from "svelte/easing";

import Input from "../../components/Input/Input.svelte";
import Slider from "../../components/Slider/Slider.svelte";
import InformationHeader from "../../components/InformationHeader/InformationHeader.svelte";
import SpinMeButton from "../../components/SpinMeButton/SpinMeButton.svelte";

import {
  inputRanges,
  randomizeInputs,
  getDefaultHarmonograph,
  createSVGPathData,
} from "../../Harmonograph";

import { PluginMessages } from "../../Messages";

import "./CreateHarmonograph.scss";

export let openWebsite = () => console.log("not implemented!");
export let navigateToAbout = () => console.log("not implemented!");
export let currentHarmonograph = getDefaultHarmonograph();

var svg = "";

var selectedPanel = 0;
let checkbox = false;

$: activeMode = checkbox ? "advanced" : "simple";
let svgPath = "";

function randomizeAllInputs() {
  currentHarmonograph = randomizeInputs(currentHarmonograph, activeMode);
  drawHarmonographSVG(currentHarmonograph);
}

function resetToDefaults() {
  currentHarmonograph = getDefaultHarmonograph(activeMode);
  drawHarmonographSVG(currentHarmonograph);
  saveHarmonograph();
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "none" ? "flex" : "none";
}

onMount(() => {
  drawHarmonographSVG(currentHarmonograph);

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

function insertHarmonograph() {
  saveHarmonograph();

  parent.postMessage(
    {
      pluginMessage: {
        type: PluginMessages.insertHarmonograph,
        harmonograph: currentHarmonograph,
        pathData: svgPath,
      },
    },
    "*",
  );
}

function saveHarmonograph() {
  parent.postMessage(
    {
      pluginMessage: {
        type: PluginMessages.saveHarmonograph,
        harmonograph: currentHarmonograph,
      },
    },
    "*",
  );
}

let renderPath = true;
let diameter = 320;
let stroke_width = 0.2;

function drawHarmonographSVG(harmonograph) {
  svg = document.getElementById("preview");
  svg.setAttribute("viewBox", `0 0 ${harmonograph.r} ${harmonograph.r}`);

  svgPath = createSVGPathData(harmonograph);

  diameter = harmonograph.r;
  stroke_width = harmonograph.w;

  renderPath = false;

  setTimeout(() => {
    renderPath = true;
  }, 300);
}

function updateHarmonograph(property, value) {
  currentHarmonograph[property] = value;
  drawHarmonographSVG(currentHarmonograph);
}

function cancel() {
  parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
}
</script>

<div class="wrapper">
  <SpinMeButton on:click="{randomizeAllInputs}" />

  <div
    class="preview-settings"
    style="{`--stroke_width: ${stroke_width}px;--diameter: ${diameter}px`}"
  >
    <svg
      id="preview"
      xmlns="http://www.w3.org/2000/svg"
      width="320"
      height="320"
      version="1.1"
    >
      {#if renderPath}
        <path
          id="preview_path"
          in:draw="{{
            duration: Math.min(currentHarmonograph.steps, 3000),
            easing: quintOut,
          }}"
          out:fade={{
            duration: 300
          }}
          d="{svgPath}"
        ></path>
      {/if}
    </svg>
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
          }}"
        >
          Pendulums
        </button>

        <button
          type="button"
          class="{`advanced-mode__panel-button ${selectedPanel === 1 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === 'simple' ? 'advanced-mode__panel-button--disabled' : ''}`}"
          on:click="{() => {
            if (activeMode !== 'simple') {
              selectedPanel = 1;
            }
          }}"
        >
          Paper
        </button>

        <button
          type="button"
          class="{`advanced-mode__panel-button ${selectedPanel === 2 ? 'advanced-mode__panel-button--active' : ''} ${activeMode === 'simple' ? 'advanced-mode__panel-button--disabled' : ''}`}"
          on:click="{() => {
            if (activeMode !== 'simple') {
              selectedPanel = 2;
            }
          }}"
        >
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
            info="{'This is how many times it moves'}"
          />

          <Input
            value="{currentHarmonograph.f}"
            onValueChange="{(value) => updateHarmonograph('f', value)}"
            minValue="{inputRanges.f.min}"
            maxValue="{inputRanges.f.max}"
            decimalPlaces="{inputRanges.f.decimalPlaces}"
            inputData="{'left_pendulum_frequency'}"
            unit="{'Hz'}"
            labelFieldText="{'Left pendulum frequency'}"
          />

          <Input
            value="{currentHarmonograph.g}"
            onValueChange="{(value) => updateHarmonograph('g', value)}"
            minValue="{inputRanges.g.min}"
            maxValue="{inputRanges.g.max}"
            decimalPlaces="{inputRanges.g.decimalPlaces}"
            inputData="{'right_pendulum_frequency'}"
            unit="{'Hz'}"
            labelFieldText="{'Right pendulum frequency'}"
          />

          <InformationHeader
            text="{'Amplitude'}"
            info="{'This is how many long it be'}"
          />

          <Input
            value="{currentHarmonograph.A}"
            onValueChange="{(value) => updateHarmonograph('A', value)}"
            minValue="{inputRanges.A.min}"
            maxValue="{inputRanges.A.max}"
            decimalPlaces="{inputRanges.A.decimalPlaces}"
            inputData="{'pendulum_left_amplitude'}"
            unit="{'degrees'}"
            labelFieldText="{'Pendulum left amplitude'}"
          />

          <Input
            value="{currentHarmonograph.B}"
            onValueChange="{(value) => updateHarmonograph('B', value)}"
            minValue="{inputRanges.B.min}"
            maxValue="{inputRanges.B.max}"
            decimalPlaces="{inputRanges.B.decimalPlaces}"
            inputData="{'pendulum_right_amplitude'}"
            unit="{'degrees'}"
            labelFieldText="{'Pendulum right amplitude'}"
          />

          <InformationHeader
            text="{'Steps'}"
            info="{'This is how many times it steps'}"
          />

          <Slider
            min="{0}"
            max="{5000}"
            inputFieldMax="{8000}"
            value="{currentHarmonograph.steps}"
            onValueChange="{(value) => updateHarmonograph('steps', value)}"
          />
        {:else}
          <div class="{`harmono-panel${selectedPanel === 0 ? '' : ' hidden'}`}">
            <InformationHeader
              text="{'Frequency'}"
              info="{'This is how many times it moves'}"
            />

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
                labelFieldText="{'Left pendulum frequency'}"
              />

              <Input
                value="{currentHarmonograph.g}"
                onValueChange="{(value) => updateHarmonograph('g', value)}"
                minValue="{inputRanges.g.min}"
                maxValue="{inputRanges.g.max}"
                decimalPlaces="{inputRanges.g.decimalPlaces}"
                inputData="{'right_pendulum_frequency'}"
                hideRandomizeButton="{true}"
                unit="{'Hz'}"
                labelFieldText="{'Right pendulum frequency'}"
              />
            </div>

            <InformationHeader
              text="{'Amplitude'}"
              info="{'This is how many long it be'}"
            />

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
                labelFieldText="{'Pendulum left amplitude'}"
              />

              <Input
                value="{currentHarmonograph.B}"
                onValueChange="{(value) => updateHarmonograph('B', value)}"
                minValue="{inputRanges.B.min}"
                maxValue="{inputRanges.B.max}"
                decimalPlaces="{inputRanges.B.decimalPlaces}"
                inputData="{'pendulum_right_amplitude'}"
                hideRandomizeButton="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Pendulum right amplitude'}"
              />
            </div>

            <InformationHeader
              text="{'Damping'}"
              info="{'This is how damping'}"
            />

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
                labelFieldText="{'Left pendulum'}"
              />

              <Input
                value="{currentHarmonograph.S}"
                onValueChange="{(value) => updateHarmonograph('S', value)}"
                minValue="{inputRanges.S.min}"
                maxValue="{inputRanges.S.max}"
                decimalPlaces="{inputRanges.S.decimalPlaces}"
                inputData="{'right_pendulum_damping'}"
                hideRandomizeButton="{true}"
                unit="{'degrees'}"
                labelFieldText="{'Right pendulum'}"
              />
            </div>

            <InformationHeader
              text="{'Phase'}"
              info="{'This is how phasing bro'}"
            />

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
                labelFieldText="{'Left pendulum'}"
              />

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
                labelFieldText="{'Right pendulum'}"
              />
            </div>

            <InformationHeader
              text="{'Distance between pendulums'}"
              info="{'This is how distance bro'}"
            />

            <Input
              value="{currentHarmonograph.d}"
              onValueChange="{(value) => updateHarmonograph('d', value)}"
              minValue="{inputRanges.d.min}"
              maxValue="{inputRanges.d.max}"
              decimalPlaces="{inputRanges.d.decimalPlaces}"
              inputData="{'distance_between_pendulums'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Distance'}"
            />
          </div>

          <div class="{`harmono-panel${selectedPanel === 1 ? '' : ' hidden'}`}">
            <InformationHeader
              text="{'Paper Center'}"
              info="{'This is how paper center bro'}"
            />

            <Input
              value="{currentHarmonograph.c}"
              onValueChange="{(value) => updateHarmonograph('c', value)}"
              minValue="{inputRanges.c.min}"
              maxValue="{inputRanges.c.max}"
              decimalPlaces="{inputRanges.c.decimalPlaces}"
              inputData="{'paper_center'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Location'}"
            />

            <InformationHeader
              text="{'Length of pen arm'}"
              info="{'This is how paper length bro'}"
            />

            <Input
              value="{currentHarmonograph.p}"
              onValueChange="{(value) => updateHarmonograph('p', value)}"
              minValue="{inputRanges.p.min}"
              maxValue="{inputRanges.p.max}"
              decimalPlaces="{inputRanges.p.decimalPlaces}"
              inputData="{'length_of_pen_arm'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Length'}"
            />

            <InformationHeader
              text="{'Position of pen arm'}"
              info="{'This is how position pen bro'}"
            />

            <Input
              value="{currentHarmonograph.q}"
              onValueChange="{(value) => updateHarmonograph('q', value)}"
              minValue="{inputRanges.q.min}"
              maxValue="{inputRanges.q.max}"
              decimalPlaces="{inputRanges.q.decimalPlaces}"
              inputData="{'position_of_pen_arm'}"
              hideRandomizeButton="{true}"
              hideUnits="{true}"
              labelFieldText="{'Position'}"
            />

            <InformationHeader
              text="{'Paper Radius'}"
              info="{'This is how paper radius bro'}"
            />

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
              labelFieldText="{'Length'}"
            />

            <InformationHeader
              text="{'Frequency of paper rotation'}"
              info="{'This is how paper rotaion frequency bro'}"
            />

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
              labelFieldText="{'Frequency'}"
            />
          </div>

          <div class="{`harmono-panel${selectedPanel === 2 ? '' : ' hidden'}`}">
            <InformationHeader
              text="{'Pen thickness (stroke)'}"
              info="{'This is how pen thickness bro'}"
            />

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
              labelFieldText="{'Thickness'}"
            />

            <InformationHeader
              text="{'Steps'}"
              info="{'This is how many times it steps'}"
            />

            <Slider
              min="{0}"
              max="{5000}"
              inputFieldMax="{8000}"
              value="{currentHarmonograph.steps}"
              onValueChange="{(value) => updateHarmonograph('steps', value)}"
            />

            <InformationHeader
              text="{'Segments per Step'}"
              info="{'This is how segments bro'}"
            />

            <Slider
              value="{currentHarmonograph.segments}"
              min="{1}"
              max="{50}"
              inputFieldMax="{50}"
              onValueChange="{(value) => updateHarmonograph('segments', value)}"
            />
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <footer class="footer">
    <div class="footer__content">
      <button
        class="footer__button footer__button--primary"
        on:click="{insertHarmonograph}"
      >
        Add to canvas
      </button>

      <div class="footer__content__right">
        <div class="svg-container" on:click="{resetToDefaults}">
          <svg
            id="reset-svg"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_947_45942)">
              <path
                d="M1.44263 2.83331V7.08331H5.69263"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M17.0261 14.1667V9.91669H12.7761"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M15.248 6.37497C14.8888 5.35978 14.2782 4.45213 13.4733 3.73673C12.6684 3.02132 11.6954 2.52147 10.6451 2.28382C9.59476 2.04617 8.50134 2.07846 7.46687 2.37769C6.43239 2.67691 5.49057 3.23331 4.72929 3.99497L1.44263 7.08331M17.026 9.91664L13.7393 13.005C12.978 13.7666 12.0362 14.323 11.0017 14.6223C9.96724 14.9215 8.87383 14.9538 7.8235 14.7161C6.77316 14.4785 5.80015 13.9786 4.99525 13.2632C4.19035 12.5478 3.57979 11.6402 3.22054 10.625"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_947_45942">
                <rect
                  width="17"
                  height="17"
                  fill="white"
                  transform="translate(0.734375)"
                ></rect>
              </clipPath>
            </defs>
          </svg>
        </div>

        <div class="ellipsis-menu" aria-label="More options">
          <div
            class="ellipsis-menu__container"
            on:click|stopPropagation="{toggleMenu}"
          >
            <div class="ellipsis-menu__dots">
              <span class="ellipsis-menu__dot"></span>
              <span class="ellipsis-menu__dot"></span>
              <span class="ellipsis-menu__dot"></span>
            </div>
          </div>

          <div id="menu" class="ellipsis-menu__dropdown" style="display: none;">
            <div class="ellipsis-menu__divider"></div>
            <button
              class="ellipsis-menu__option"
              on:click="{() => {
                navigateToAbout();
                toggleMenu();
              }}">About this plugin</button
            >
            <div class="ellipsis-menu__divider"></div>
            <button
              class="ellipsis-menu__option"
              on:click="{() => {
                openWebsite();
                toggleMenu();
              }}">@thirteen23</button
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>
