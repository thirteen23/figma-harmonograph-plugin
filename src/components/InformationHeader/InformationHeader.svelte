<script>
import { fade } from "svelte/transition";

import "./InformationHeader.scss";

export let text = "";
export let info = "";

let tooltipRef;
let componentRef;
let rendersAbove = true;

const checkTooltipVisibility = () => {
  const tooltipRect = tooltipRef.getBoundingClientRect();
  const parentRect = componentRef.getBoundingClientRect();
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;
  const leftPad = viewportWidth * 0.05;

  let horizontalOffset = 0;
  let tooltipHeight = tooltipRect.bottom - tooltipRect.top;

  // Magic number for scroll offset
  rendersAbove = Math.ceil(parentRect.top - tooltipHeight) >= 515;

  // Check only once, this prevents jumping offscreen on second onmouseenter
  if (tooltipRef.style.left === "") {
    if (tooltipRect.left < 0) {
      horizontalOffset = tooltipRect.left * -1 + leftPad;
    } else if (tooltipRect.left < leftPad) {
      horizontalOffset = leftPad - tooltipRect.left;
    }

    tooltipRef.style = `left: ${horizontalOffset}px`;
  }
};
</script>

<div
  bind:this="{componentRef}"
  class="information-header"
  in:fade="{{
    duration: 300,
  }}"
>
  <h2 class="information-header__title">{text}</h2>
  <div class="information-header__icon-container">
    <svg
      width="17"
      height="17"
      class="information-header__icon"
      viewBox="0 0 17 17"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      on:mouseenter="{() => {
        checkTooltipVisibility();
      }}"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.18945 8.11377C1.18945 4.24778 4.32346 1.11377 8.18945 1.11377C12.0554 1.11377 15.1895 4.24778 15.1895 8.11377C15.1895 11.9798 12.0554 15.1138 8.18945 15.1138C4.32346 15.1138 1.18945 11.9798 1.18945 8.11377ZM8.18945 16.1138C3.77118 16.1138 0.189453 12.532 0.189453 8.11377C0.189453 3.69549 3.77118 0.11377 8.18945 0.11377C12.6077 0.11377 16.1895 3.69549 16.1895 8.11377C16.1895 12.532 12.6077 16.1138 8.18945 16.1138ZM7.68945 11.6138V11.1138V8.11377V7.61377H8.68945V8.11377V11.1138V11.6138H7.68945ZM8.93945 5.11386C8.93945 5.52807 8.60367 5.86386 8.18945 5.86386C7.77524 5.86386 7.43945 5.52807 7.43945 5.11386V5.0453C7.43945 4.63109 7.77524 4.2953 8.18945 4.2953C8.60367 4.2953 8.93945 4.63109 8.93945 5.0453V5.11386Z"
        fill="currentColor"
        fill-opacity="0.8"
      ></path>
    </svg>

    <div
      class="{`information-header__info-container information-header__info-container${rendersAbove ? '--above' : '--below'}`}"
    >
      <div
        style=""
        class="{`information-header__info-panel information-header__info-panel${rendersAbove ? '--above' : '--below'}`}"
        bind:this="{tooltipRef}"
      >
        {info}
      </div>
    </div>
  </div>
</div>
