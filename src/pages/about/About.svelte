<script>
import { GlobalCSS } from "figma-plugin-ds-svelte";

import { fade } from "svelte/transition";
import { onMount } from "svelte";

import SpinMeButton from "../../components/SpinMeButton/SpinMeButton.svelte";
import homeImage from "../../static/harmonographs.png";
import Footer from "../../components/Footer/Footer.svelte";

import "./About.scss";

export let openWebsite = (url) => console.log("not implemented!");
export let navigateToHarmonograph = () => console.log("not implemented!");

onMount(() => {
  document.addEventListener("click", handleOutsideClick);

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };
});

function handleOutsideClick(event) {
  const menu = document.getElementById("menu");
  const ellipsisMenu = document.querySelector(".ellipsis-menu");

  if (!ellipsisMenu.contains(event.target) && menu.style.display !== "none") {
    menu.style.display = "none";
  }
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
          A harmonograph is a device that uses pendulums to draw geometric art.
          This plugin uses two pendulums in its calculation. One moves a pen
          back and forth along one axis, while the other moves the drawing
          surface back and forth along a perpendicular axis. By varying their
          amplitudes, frequencies and phases, you can create unique patterns.
        </p>
      </div>

      <div class="about__instructions">
        <h2 class="about__instructions-title">HOW TO USE</h2>
        <ol class="about__instructions-list">
          <li class="about__instructions-step">
            To begin, make minor changes to each pendulum's frequency.
          </li>
          <li class="about__instructions-step">
            To vary the pattern slightly adjust the phase of the pendulums.
          </li>
          <li class="about__instructions-step">
            Explore the other parameters to create unique patterns.
          </li>
          <li class="about__instructions-step">
            Once satisfied, add the generate harmonograph to the canvas!
          </li>
          <li class="about__instructions-step">
            Still wanting to make changes? Run the plugin again, select a
            previously generated harmonograph, and select "Load from selection"
            from the footer menu.
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
            top="0"
          />

          <span>for a surprise!</span>
          <br />
        </div>
        <div class="about__tips-description">
          <span
            >Or for more fun, select more than one harmonograph when loading
            from selection.</span
          >
        </div>
        <div class="about__tips-description">
          <span
            >When adjusting the left and right pendulum frequencies, use
            harmonic ratios that are common to music to create visually
            harmonious patterns. Give it a try!</span
          >
        </div>
        <div class="about__tips-description">
          <span
            tabindex="0"
            role="button"
            on:keydown="{(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              e.target.click();
            }}"
            on:click="{openWebsite(
              'https://www.worldtreesoftware.com/apps/web/harmonograph/intro/',
            )}"
            class="about__credits-link"
            >Read more about harmonographs and harmonic ratios</span
          >
        </div>
      </div>

      <div class="about__credits">
        <p class="about__credits-text">
          Inspired by
          <span
            tabindex="0"
            role="button"
            on:keydown="{(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              e.target.click();
            }}"
            on:click="{openWebsite('https://ttencate.github.io/harmonograph/')}"
            class="about__credits-link">Harmonograph in JavaScript</span
          >
        </p>
      </div>
    </div>
  </div>

  <Footer
    primaryButton="{{
      fullWidth: true,
      text: 'Get started',
      action: navigateToHarmonograph,
    }}"
    options="{[
      {
        text: '@thirteen23',
        action: () => {
          openWebsite('http://www.thirteen23.com');
        },
      },
    ]}"
  />
</div>
