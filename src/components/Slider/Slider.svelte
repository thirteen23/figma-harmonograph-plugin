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
  let newValue = event.target.value;
  setValue(newValue, inputFieldMax);
}

function handleKeyDown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const direction = event.key === "ArrowUp" ? 1 : -1;
    const factor = event.shiftKey ? 10 : 1;
    const change = direction * factor * increment;
    const newValue = parseFloat(value) + change;
    setValue(newValue, event.target.type === "number" ? inputFieldMax : max);
  }
}

function setValue(newValue, upperLimit = max) {
  newValue = Math.max(min, Math.min(upperLimit, parseFloat(newValue)));
  value = newValue;
  onValueChange(value);
}
</script>

<div
  class="slider"
  in:fade="{{
    duration: 300,
  }}">
  <div class="slider__range-container">
    <input
      class="slider__range"
      type="range"
      min="{min}"
      max="{max}"
      step="0"
      bind:value="{value}"
      on:keydown="{handleKeyDown}"
      on:input="{handleSliderInput}" />
    <div class="slider__value-range">
      <div class="slider__lowest-value">{min}</div>
      <div class="slider__highest-value">{max}</div>
    </div>
  </div>

  <input
    class="slider__input"
    type="number"
    min="{min}"
    max="{max}"
    bind:value="{value}"
    on:keydown="{handleKeyDown}"
    on:input="{handleInputField}" />
</div>
