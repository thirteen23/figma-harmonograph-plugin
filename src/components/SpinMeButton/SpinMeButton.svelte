<script>
import { createEventDispatcher } from "svelte";

import "./SpinMeButton.scss";

export let fontSize = "11px";
export let width = "70px";
export let height = "70px";
export let position = "absolute";
export let right = "24px";
export let top = "248px";
export let zIndex = "100000";

const dispatch = createEventDispatcher();

function spinCircle() {
  const circle = document.querySelector(".spin-me-button");
  circle.classList.remove("spin-me-button--rotate");
  void circle.offsetWidth;
  circle.classList.add("spin-me-button--rotate");

  dispatch("click");
}
</script>

<div
  class="spin-me-button"
  tabindex="0"
  role="button"
  on:click="{spinCircle}"
  on:keydown="{(e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.target.click();
  }}"
  style="z-index:{zIndex}; width: {width}; height: {height}; position:{position}; right:{right}; top:{top};"
>
  <div class="spin-me-button__text" style="font-size: {fontSize};">SPIN ME</div>
</div>
