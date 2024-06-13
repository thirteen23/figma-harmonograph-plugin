<script>
import "./SpinMeButton.scss";

import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

function spinCircle() {
  const circle = document.querySelector(".spin-me-button");
  circle.classList.remove("spin-me-button--rotate");
  void circle.offsetWidth;
  circle.classList.add("spin-me-button--rotate");

  dispatch("click");
}
</script>

<div class="spin-me-button" on:click="{spinCircle}">
  <div class="spin-me-button__text">SPIN ME</div>
</div>
