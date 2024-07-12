<script>
import { fade } from "svelte/transition";

import "./Input.scss";

export let value;
export let onValueChange;
export let minValue = 0;
export let maxValue = 1;
export let decimalPlaces = 0;
export let inputData = "";
export let labelFieldText = "";
export let unit = "";
export let hideUnits = false;
export let increment = 1;

function randomizeValue() {
  const range = maxValue - minValue;
  const randomValue = Math.random() * range + minValue;
  value = parseFloat(randomValue.toFixed(decimalPlaces));
  onValueChange(value);
}

function handleChange(event) {
  value = event.target.value;
  onValueChange(value);
}

function handleBlur() {
  let newValue = parseFloat(value);
  if (!isNaN(newValue)) {
    newValue = Math.min(Math.max(newValue, minValue), maxValue);
    newValue = parseFloat(newValue.toFixed(decimalPlaces));
    value = newValue;
    onValueChange(value);
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

    let newValue = parseFloat(value) + change;
    newValue = Math.min(Math.max(newValue, minValue), maxValue);
    newValue = parseFloat(newValue.toFixed(decimalPlaces));

    value = newValue;
    onValueChange(value);
  }
}
</script>

<div
  class="input"
  in:fade="{{
    duration: 300,
  }}">
  <label class="input__label" for="{inputData}">{labelFieldText}</label>

  <div class="input__wrapper">
    <input
      class="input__field"
      id="{inputData}"
      iconText="°"
      type="text"
      bind:value="{value}"
      on:input="{handleChange}"
      on:blur="{handleBlur}"
      on:keydown="{handleKeyDown}" />

    <div
      for="{inputData}"
      class="input__unit {!hideUnits ? '' : 'input__unit--hidden'}">
      {unit}
    </div>

    <div
      class="input__svg-container"
      on:click="{randomizeValue}"
      tabindex="0"
      role="button"
      on:keydown="{(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        e.target.click();
      }}">
      <svg
        class="input__randomize"
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.8323 11.5123C12.8594 11.5123 12.884 11.5263 12.8939 11.5521C12.9062 11.5755 12.899 11.6036 12.8793 11.6224C12.6748 11.8168 12.2658 12.2055 12.2658 12.2055C11.985 12.4725 11.985 12.9058 12.2658 13.1728C12.5466 13.4398 12.9999 13.4398 13.2807 13.1728C13.2807 13.1728 15.1451 11.4022 15.6402 10.9291C15.6722 10.8987 15.6895 10.8565 15.6895 10.8143C15.6895 10.7722 15.6722 10.73 15.6402 10.6996C15.1451 10.2265 13.2807 8.45583 13.2807 8.45583C12.9999 8.18883 12.5466 8.18883 12.2658 8.45583C11.985 8.72283 11.985 9.15613 12.2658 9.42313C12.2658 9.42313 12.6969 9.83298 12.9087 10.0344C12.9284 10.0531 12.9358 10.0812 12.9235 10.1047C12.9137 10.1304 12.889 10.1445 12.8619 10.1445C12.4876 10.1445 11.6108 10.1421 11.6108 10.1421C11.2807 10.1421 10.9505 9.98989 10.6032 9.7674C10.1624 9.48166 9.71659 9.07886 9.26338 8.61044C9.26338 8.61044 8.99741 8.3364 8.85948 8.19353C8.83731 8.17011 8.80776 8.15607 8.77327 8.15607C8.74125 8.15373 8.70923 8.16541 8.68707 8.18649C8.48756 8.36214 8.00969 8.77905 7.81018 8.95471C7.78555 8.97579 7.77073 9.0039 7.77073 9.03435C7.76827 9.0648 7.7807 9.09524 7.80287 9.11866C7.9408 9.26152 8.20677 9.53557 8.20677 9.53557C9.36194 10.7277 10.5393 11.5076 11.6083 11.5076C11.6083 11.5076 12.4653 11.5099 12.8323 11.5123ZM12.8793 2.60532C12.899 2.62406 12.9062 2.64982 12.8939 2.67558C12.884 2.699 12.8594 2.71538 12.8323 2.71538C12.4653 2.71538 11.6083 2.71771 11.6083 2.71771C10.8571 2.71771 10.0566 3.08076 9.25857 3.71781C8.25611 4.5188 7.21655 5.76714 6.18206 7.02015C5.21162 8.1912 4.24872 9.36924 3.3103 10.1187C2.81522 10.5145 2.34955 10.8003 1.88403 10.8003C1.88403 10.8003 1.11556 10.8003 0.812606 10.8003C0.74364 10.8003 0.689453 10.8518 0.689453 10.915C0.689453 11.175 0.689453 11.791 0.689453 12.0486C0.689453 12.0814 0.701922 12.1095 0.72409 12.1329C0.74872 12.154 0.778123 12.1657 0.812606 12.1657C1.01704 12.1657 1.40874 12.1657 1.40874 12.1657H1.88403C2.63773 12.1657 3.43591 11.805 4.23394 11.1657C5.2364 10.3647 6.27581 9.11632 7.31276 7.86331C8.28074 6.69226 9.2461 5.51417 10.1845 4.76471C10.6796 4.36889 11.1428 4.08317 11.6083 4.08317H11.6108C11.6108 4.08317 12.4876 4.08083 12.8619 4.08083C12.889 4.08083 12.9137 4.09721 12.9235 4.12063C12.9358 4.14405 12.9284 4.17216 12.9087 4.19089C12.6969 4.39466 12.2658 4.80455 12.2658 4.80455C11.985 5.07155 11.985 5.50247 12.2658 5.76947C12.5466 6.03647 12.9999 6.03647 13.2807 5.76947C13.2807 5.76947 15.1451 3.99883 15.6402 3.52573C15.6722 3.49528 15.6895 3.45551 15.6895 3.41101C15.6895 3.36885 15.6722 3.32668 15.6402 3.29623C15.1451 2.82547 13.2807 1.0525 13.2807 1.0525C12.9999 0.78784 12.5466 0.78784 12.2658 1.0525C11.985 1.31949 11.985 1.7528 12.2658 2.0198C12.2658 2.0198 12.6748 2.40858 12.8793 2.60532ZM1.40874 3.42738H1.88403C2.29783 3.42738 2.71174 3.65689 3.1477 3.98244C3.69942 4.3923 4.25857 4.96381 4.82507 5.60086C4.82507 5.60086 5.07615 5.88425 5.20916 6.03414C5.22886 6.05757 5.26104 6.0716 5.29306 6.07394C5.32507 6.07863 5.35694 6.06693 5.38157 6.04819C5.58847 5.8819 6.08354 5.48372 6.2929 5.31743C6.31753 5.29635 6.33239 5.26828 6.33485 5.23783C6.33731 5.20739 6.32742 5.1769 6.30772 5.15348C6.17471 5.00359 5.92113 4.7202 5.92113 4.7202C5.1502 3.85128 4.38165 3.09948 3.63781 2.63341C3.04421 2.26101 2.453 2.05959 1.88403 2.05959H0.689453V3.42738H1.40874Z"
          fill="currentColor"
          fill-opacity="0.8"></path>
      </svg>
    </div>
  </div>
</div>
