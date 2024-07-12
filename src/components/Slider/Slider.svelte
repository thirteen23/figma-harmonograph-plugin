<script>
import { fade } from "svelte/transition";

import "./Slider.scss";

export let value;
export let onValueChange;
export let min = 0;
export let max = 5000;
export let inputFieldMax = 5000;
export let increment = 1;

let inputValue = value.toString();
let isInputEmpty = false;

function handleSliderInput(event) {
  let newValue = event.target.value;
  setValue(newValue);
}

function handleInputField(event) {
  const newValue = event.target.value;

  if (newValue === "") {
    isInputEmpty = true;
    inputValue = "";
    return;
  }

  isInputEmpty = false;

  if (newValue === "-" || newValue === ".") {
    inputValue = newValue;
    return;
  }

  const parsedValue = parseFloat(newValue);

  if (!isNaN(parsedValue)) {
    inputValue = newValue;
    setValue(parsedValue, false);
  }
}

function handleInputBlur() {
  if (isInputEmpty) {
    setValue(min);
    isInputEmpty = false;
  } else {
    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue)) {
      setValue(min);
    } else {
      setValue(parsedValue);
    }
  }
}

function handleKeyDown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const direction = event.key === "ArrowUp" ? 1 : -1;
    const factor = event.shiftKey ? 10 : 1;
    const change = direction * factor * increment;
    const currentValue = parseFloat(value) || 0;
    const newValue = currentValue + change;
    setValue(newValue, event.target.type === "number" ? inputFieldMax : max);
  }
}

function setValue(newValue, updateInput = true, upperLimit = max) {
  newValue = Math.max(min, Math.min(upperLimit, parseFloat(newValue) || min));
  value = newValue;
  if (updateInput) {
    inputValue = newValue.toString();
  }
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
    type="text"
    inputmode="numeric"
    bind:value="{inputValue}"
    on:keydown="{handleKeyDown}"
    on:input="{handleInputField}"
    on:blur="{handleInputBlur}" />
</div>
