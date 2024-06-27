<script>
import { GlobalCSS } from "figma-plugin-ds-svelte";
import homeImage from "../../harmonographs.png";
import { onMount, createEventDispatcher } from "svelte";

import SpinMeButton from "../../components/SpinMeButton/SpinMeButton.svelte";

import {
  inputRanges,
  randomizeInputs,
  getDefaultInputs,
} from "../../HarmonographParams.js";

import "./About.scss";

const dispatch = createEventDispatcher();

onMount(() => {
  document.addEventListener("click", handleOutsideClick);
  const edge = document.querySelector(".about__edge-bottom");

  edge.onpointerdown = (e) => {
    edge.onpointermove = resizeWindow;
    edge.setPointerCapture(e.pointerId);
  };
  edge.onpointerup = (e) => {
    edge.onpointermove = null;
    edge.releasePointerCapture(e.pointerId);
  };

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };
});

function switchToPluginUIPage() {
  window.parent.postMessage(
    { pluginMessage: { type: "ui-switched-to-PluginUIPage" } },
    "*",
  );
  dispatch("switch", 0);
}

function resizeWindow(e) {
  const height = Math.max(50, Math.floor(e.clientY + 5));
  parent.postMessage(
    { pluginMessage: { type: "resize-window", height: height } },
    "*",
  );
}

function openWebsite() {
  window.open("https://www.thirteen23.com/", "_blank");
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "none" ? "flex" : "none";
}

function handleOutsideClick(event) {
  const menu = document.getElementById("menu");
  const ellipsisMenu = document.querySelector(".ellipsis-menu");

  if (!ellipsisMenu.contains(event.target) && menu.style.display !== "none") {
    menu.style.display = "none";
  }
}

function resetToDefaults() {
  currentHarmonograph = getDefaultInputs(activeMode);
  drawHarmonographSVG(currentHarmonograph);
  saveHarmonograph();
}
</script>

<div class="about">
  <div class="about__image">
    <img class="about__image-img" alt="harmonographs" src="{homeImage}" />
  </div>

  <div class="about__content">
    <div class="about__content-wrapper">
      <div class="about__harmonograph-information">
        <h1 class="about__harmonograph-information-title">Harmonographs</h1>
        <p class="about__harmonograph-information-description">
          A harmonograph is a device that uses two pendulums to draw a geometric
          image. One moves a pen back and forth along one axis, while the other
          moves the drawing surface back and forth along a perpendicular axis.
          By varying their amplitudes, frequencies and the phase difference, you
          can create unique patterns.
        </p>
      </div>

      <div class="about__instructions">
        <h2 class="about__instructions-title">HOW TO USE</h2>
        <ol class="about__instructions-list">
          <li class="about__instructions-step">
            To begin, enter values for each input field or select a pre-saved
            harmonograph.
          </li>
          <li class="about__instructions-step">
            Once satisfied, add the generated harmonograph to canvas.
          </li>
          <li class="about__instructions-step">
            Save your harmonograph for later.
          </li>
        </ol>
      </div>

      <div class="about__tips">
        <h2 class="about__tips-title">Tips</h2>
        <div class="about__tips-description">
          <span>To randomly generated harmonographs, click </span>

          <SpinMeButton
            zIndex="1"
            fontSize="6px"
            width="30px"
            height="30px"
            position="relative"
            right="0"
            top="0" />

          <span>for a surprise!</span>
        </div>
      </div>

      <div class="about__credits">
        <p class="about__credits-text">
          Inspired by
          <a
            class="about__credits-link"
            href="https://ttencate.github.io/harmonograph/"
            >Harmonograph in JavaScript</a>
        </p>
      </div>
    </div>
  </div>

  <footer class="footer">
    <div class="footer__content">
      <button
        on:click="{switchToPluginUIPage}"
        class="footer__button footer__button--primary">
        Get Started
      </button>
      <div class="ellipsis-menu" aria-label="More options">
        <div
          class="ellipsis-menu__dots"
          on:click|stopPropagation="{toggleMenu}">
          <span class="ellipsis-menu__dot"></span>
          <span class="ellipsis-menu__dot"></span>
          <span class="ellipsis-menu__dot"></span>
        </div>

        <div id="menu" class="ellipsis-menu__dropdown" style="display: none;">
          <button
            class="ellipsis-menu__option"
            on:click="{() => {
              resetToDefaults();
              toggleMenu();
            }}">Reset params</button>
          <div class="ellipsis-menu__divider"></div>
          <button
            class="ellipsis-menu__option"
            on:click="{() => {
              switchToAboutPage();
              toggleMenu();
            }}">About this plugin</button>
          <div class="ellipsis-menu__divider"></div>
          <button
            class="ellipsis-menu__option"
            on:click="{() => {
              openWebsite();
              toggleMenu();
            }}">@thirteen23</button>
        </div>
      </div>
    </div>
  </footer>
  <div class="edge-bottom"></div>
</div>
