<script lang="ts">
import { onMount } from "svelte";

import CreateHarmonograph from "./pages/main/CreateHarmonograph.svelte";
import About from "./pages/about/About.svelte";
import { EventMessages, PluginMessages } from "./Messages";

import "./App.scss";

$: currentPage = -1;
$: loadedHarmonograph = undefined;

addEventListener("message", function handleMessage(msg) {
  console.log("got message: ", msg);
  switch (msg.data.pluginMessage.type) {
    case EventMessages.loadState:
      currentPage = msg.data.pluginMessage.page;
      loadedHarmonograph = msg.data.pluginMessage.harmonograph;
      break;
  }
});

function resizeWindow(e) {
  const height = Math.floor(e.clientY + 5);

  parent.postMessage(
    { pluginMessage: { type: PluginMessages.resizeWindow, height } },
    "*",
  );

  const optionsContainer = document.querySelector(".options");
  if (optionsContainer) {
    const maxHeight = height - 400;
    if (maxHeight < 305) {
      optionsContainer.style.maxHeight = `305px`;
    } else {
      optionsContainer.style.maxHeight = `${maxHeight}px`;
    }
  }
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
  const edge = document.getElementById("edge_bottom");

  if (edge) {
    edge.onpointerdown = (e) => {
      edge.onpointermove = resizeWindow;
      edge.setPointerCapture(e.pointerId);
    };
    edge.onpointerup = (e) => {
      edge.onpointermove = null;
      edge.releasePointerCapture(e.pointerId);
    };
  }

  return () => {};
});
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

  <div id="edge_bottom"></div>
</div>
