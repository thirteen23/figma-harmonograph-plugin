<script>
import { fade } from "svelte/transition";

import "./Slider.scss";

export let value;
export let onValueChange;
export let min = 0;
export let max = 5000;
export let inputFieldMax = 5000;
export let increment = 1;

function handleSliderInput(event) {
  let newValue = event.target.value;
  setValue(newValue);
}

function handleInputField(event) {
  value = event.target.value;
  onValueChange(value);
}

function handleInputBlur() {
  let newValue = parseFloat(value);
  if (isNaN(newValue)) {
    newValue = min;
  } else {
    newValue = Math.min(Math.max(newValue, min), inputFieldMax);
  }
  setValue(newValue);
}

function handleKeyDown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const multiplier = event.shiftKey ? 10 : 1;
    const change =
      event.key === "ArrowUp"
        ? increment * multiplier
        : -increment * multiplier;

    let newValue = parseFloat(value) + change;
    newValue = Math.min(
      Math.max(newValue, min),
      event.target.type === "range" ? max : inputFieldMax,
    );

    setValue(newValue);
  }
}

function setValue(newValue) {
  value = parseFloat(newValue);
  if (isNaN(value)) {
    value = min;
  }
  value = Math.min(Math.max(value, min), inputFieldMax);
  onValueChange(value);
}
</script>

<div
  class="slider"
  in:fade="{{
    duration: 300,
  }}"
>
  <div class="slider__range-container">
    <input
      class="slider__range"
      type="range"
      min="{min}"
      max="{max}"
      step="0"
      bind:value="{value}"
      on:input="{handleSliderInput}"
      on:keydown="{handleKeyDown}"
    />
    <div class="slider__value-range">
      <div class="slider__lowest-value">{min}</div>
      <div class="slider__highest-value">{max}</div>
    </div>
  </div>

  <input
    class="slider__input"
    type="text"
    inputmode="numeric"
    bind:value="{value}"
    on:input="{handleInputField}"
    on:blur="{handleInputBlur}"
    on:keydown="{handleKeyDown}"
  />
</div>
