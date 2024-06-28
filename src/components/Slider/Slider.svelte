<script>
import "./Slider.scss";

export let value;
export let onValueChange;
export let min = 0;
export let max = 5000;

function handleInput(event) {
  let newValue = event.target.value;

  if (newValue < min) {
    newValue = min;
  } else if (newValue > max) {
    newValue = max;
  }

  value = newValue;
  onValueChange(value);
}
</script>

<div class="slider">
  <div class="slider__range-container">
    <input
      class="slider__range"
      type="range"
      min="{min}"
      max="{max}"
      step="0"
      bind:value="{value}"
      on:input="{handleInput}" />
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
    on:input="{handleInput}" />
</div>
