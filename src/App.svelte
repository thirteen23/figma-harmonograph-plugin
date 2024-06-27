<script>
import PluginUI from "./pages/main/PluginUI.svelte";
import About from "./pages/about/About.svelte";

import "./App.scss";

$: switchValue = 0;

function handleSwitch(event) {
  switchValue = event.detail;
}
</script>

{#if switchValue === 0}
  <PluginUI on:switch="{handleSwitch}" />
{:else if switchValue === 1}
  <About on:switch="{handleSwitch}" />
{/if}
