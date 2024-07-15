<script>
import { fade } from "svelte/transition";

import { sanatizeValue } from "../../model/Harmonograph";

import "./Slider.scss";

export let field;
export let value;
export let onValueChange;
export let min = -1;
export let max = 5000;
export let increment = 1;

$: {
  if (!isNaN(value)) {
    lastValidValue = value;
  }
}

let lastValue;
let lastValidValue;

function handleLastValue(event) {
  lastValue = parseFloat(event.target.value);
}

function handleSliderInput(event) {
  let newValue = parseFloat(event.target.value);

  onValueChange(field, newValue, false);
}

function handleInputField() {
  setValue(parseFloat(value));
}

function handleInputBlur() {
  let sanatizedValue = value;

  if (isNaN(sanatizedValue)) {
    sanatizedValue = lastValidValue;
  }

  sanatizedValue = sanatizeValue(field, sanatizedValue);

  if (value !== sanatizedValue) {
    value = sanatizedValue;
  }

  if (lastValue !== undefined && lastValue !== value) {
    onValueChange(field, value);
  }
}

function handleKeyDown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const multiplier = event.shiftKey ? 10 : 1;
    const change =
      event.key === "ArrowUp"
        ? increment * multiplier
        : -increment * multiplier;

    setValue(parseFloat(value) + change);
  }
}

function setValue(newValue) {
  if (isNaN(newValue)) {
    newValue = lastValidValue;
    value = lastValidValue;
  }

  newValue = sanatizeValue(field, newValue);

  if (lastValue !== undefined && lastValue !== newValue) {
    onValueChange(field, newValue);
  }
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
    on:beforeinput="{handleLastValue}"
    on:input="{handleInputField}"
    on:blur="{handleInputBlur}"
    on:keydown="{handleKeyDown}"
  />
</div>
