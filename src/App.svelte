<script lang="ts">
import { onMount } from "svelte";

import CreateHarmonograph from "./pages/main/CreateHarmonograph.svelte";
import About from "./pages/about/About.svelte";
import { EventMessages, PluginMessages } from "./Messages";

import "./App.scss";

let currentPage = -1;
let loadedHarmonograph = undefined;

addEventListener("message", function handleMessage(msg) {
  switch (msg.data.pluginMessage.type) {
    case EventMessages.loadState:
      currentPage = msg.data.pluginMessage.page;
      loadedHarmonograph = msg.data.pluginMessage.harmonograph;
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
  {#if currentPage === 1}
    <About
      navigateToHarmonograph="{() => {
        sendFTUEComplete();
        currentPage = 0;
      }}"
      openWebsite="{openWebsite}"
    />
  {:else if currentPage === 0}
    <CreateHarmonograph
      currentHarmonograph="{loadedHarmonograph}"
      navigateToAbout="{() => {
        currentPage = 1;
      }}"
      openWebsite="{openWebsite}"
    />
  {/if}

  <div id="resize_bottom"></div>
  <div id="resize_right"></div>
  <div id="resize_corner_bottom"></div>
  <div id="resize_corner_right"></div>
</div>
