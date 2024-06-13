<script>
import "./Slider.scss";

export let value;
export let onValueChange;

function handleInput(event) {
  value = event.target.value;
  onValueChange(value);
}
</script>

<div class="slider">
  <div class="slider__range-container">
    <input
      class="slider__range"
      type="range"
      min="0"
      max="5000"
      step="0"
      bind:value="{value}"
      on:input="{handleInput}" />
    <div class="slider__value-range">
      <div class="slider__lowest-value">0</div>
      <div class="slider__highest-value">5000</div>
    </div>
  </div>

  <input
    class="slider__input"
    type="text"
    min="0"
    max="5000"
    bind:value="{value}"
    on:input="{handleInput}" />
</div>
