<script>
import { onMount } from "svelte";

import { Page } from "./model/Routes";
import { EventMessages, PluginMessages } from "./model/Messages";

import CreateHarmonograph from "./pages/main/CreateHarmonograph.svelte";
import About from "./pages/about/About.svelte";

import "./App.scss";

let currentPage = undefined;
let loadedHarmonograph = undefined;
let advancedMode = false;

addEventListener("message", function handleMessage(msg) {
  switch (msg.data.pluginMessage.type) {
    case EventMessages.loadState:
      currentPage = msg.data.pluginMessage.ftueVisited
        ? Page.harmonograph
        : Page.about;
      loadedHarmonograph = msg.data.pluginMessage.harmonograph;
      advancedMode = msg.data.pluginMessage.advancedMode;

      console.log(
        `
          Current page: ${currentPage}
          FTUE Visited?: ${msg.data.pluginMessage.ftueVisited}
          Advanced mode: ${advancedMode}
          Harmono: ${JSON.stringify(loadedHarmonograph)}
        `,
      );
      break;
  }
});

function resizeWindowVertical(e) {
  const height = Math.floor(e.clientY + 5);

  parent.postMessage(
    { pluginMessage: { type: PluginMessages.resizeWindow, height } },
    "*",
  );
}

function resizeWindowHorizontal(e) {
  const width = Math.floor(e.clientX + 5);

  parent.postMessage(
    { pluginMessage: { type: PluginMessages.resizeWindow, width } },
    "*",
  );
}

function resizeWindow(e) {
  const height = Math.floor(e.clientY + 5);
  const width = Math.floor(e.clientX + 5);

  parent.postMessage(
    { pluginMessage: { type: PluginMessages.resizeWindow, height, width } },
    "*",
  );
}

const sendFTUEComplete = () => {
  parent.postMessage(
    { pluginMessage: { type: PluginMessages.FTUEVisited } },
    "*",
  );
};

function openWebsite() {
  window.open("https://www.thirteen23.com/", "_blank");
}

onMount(() => {
  const resizeBottom = document.getElementById("resize_bottom");
  const resizeRight = document.getElementById("resize_right");
  const resizeCornerBottom = document.getElementById("resize_corner_bottom");
  const resizeCornerRight = document.getElementById("resize_corner_right");

  addResizeTrigger(resizeBottom, resizeWindowVertical);
  addResizeTrigger(resizeRight, resizeWindowHorizontal);
  addResizeTrigger(resizeCornerBottom, resizeWindow);
  addResizeTrigger(resizeCornerRight, resizeWindow);

  return () => {};
});

const addResizeTrigger = (element, resizeFunction) => {
  if (element) {
    element.onpointerdown = (e) => {
      element.onpointermove = resizeFunction;
      element.setPointerCapture(e.pointerId);
    };
    element.onpointerup = (e) => {
      element.onpointermove = null;
      element.releasePointerCapture(e.pointerId);
    };
  }
};
</script>

<div class="root">
  {#if currentPage === Page.about}
    <About
      navigateToHarmonograph="{() => {
        sendFTUEComplete();
        currentPage = Page.harmonograph;
      }}"
      openWebsite="{openWebsite}"
    />
  {:else if currentPage === Page.harmonograph}
    <CreateHarmonograph
      currentHarmonograph="{loadedHarmonograph}"
      advancedMode="{advancedMode}"
      navigateToAbout="{() => {
        currentPage = Page.about;
      }}"
      openWebsite="{openWebsite}"
    />
  {/if}

  <div id="resize_bottom"></div>
  <div id="resize_right"></div>
  <div id="resize_corner_bottom"></div>
  <div id="resize_corner_right"></div>
</div>
