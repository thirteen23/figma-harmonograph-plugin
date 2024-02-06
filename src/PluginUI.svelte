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

// let d = $state(900);





var svg = "";

var selectedPaenel = 0;

$: disabled = false; // isNaN(d) || isNaN(c) || isNaN(p) || isNaN(q) || isNaN(r) || isNaN(A) || isNaN(B) || isNaN(u) || isNaN(v) || isNaN(R) || isNaN(S) || isNaN(f) || isNaN(g) || isNaN(h) || isNaN(w);

function createHarmonograph() {
  parent.postMessage(
    {
      pluginMessage: {
        type: "create-harmonograph",
        height: height,
        width: width,
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
  width = r;
  height = r;

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

  <div class="harmono-panel-settings">
    <input type="radio" name="setting-type" value="pendulums" id="pendulums" on:change="{selectedPaenel = 0}" checked/>
    <label for="pendulums"> Pendulums </label>

    <input type="radio" name="setting-type" value="paper" id="paper" on:change="{selectedPaenel = 1}" />
    <label for="paper"> Paper </label>

    <input type="radio" name="setting-type" value="drawing" id="drawing" on:change="{selectedPaenel = 2}" />
    <label for="drawing"> Drawing </label>
  </div>

  <div class="harmono-panel">
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

  <div class="harmono-panel">
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

  <div class="harmono-panel">
    <Label>Steps</Label>
    <Input
      iconText="#"
      type="number"
      bind:value="{steps}"
      min="1"
      step="1"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />

    <Label>Segments per Step</Label>
    <input
      iconText="#"
      type="number"
      bind:value="{segments}"
      min="1"
      step="1"
      on:change="{() => drawHarmonographSVG()}"
      class="mb-xxsmall"
    />
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
