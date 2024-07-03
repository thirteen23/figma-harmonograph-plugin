<script>
import { fade } from "svelte/transition";

import { Page } from "../../model/Routes";

import "./Footer.scss";

export let primaryButton = {
  fullWidth: false,
  text: "unimplemented",
  action: () => {},
};

export let options = [
  {
    text: "Unimplemented",
    action: () => {},
  },
];

export let onResetClicked = undefined;

const toggleMenu = () => {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "none" ? "flex" : "none";
};
</script>

<footer class="footer">
  <div class="footer__content">
    <button
      on:click="{primaryButton.action}"
      class="{`footer__button footer__button--primary${primaryButton.fullWidth ? '-wide' : ''}`}"
    >
      {primaryButton.text}
    </button>

    <div class="footer__content__right">
      {#if onResetClicked !== undefined}
        <div class="svg-container" on:click="{onResetClicked}">
          <svg
            id="reset-svg"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_947_45942)">
              <path
                d="M1.44263 2.83331V7.08331H5.69263"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M17.0261 14.1667V9.91669H12.7761"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M15.248 6.37497C14.8888 5.35978 14.2782 4.45213 13.4733 3.73673C12.6684 3.02132 11.6954 2.52147 10.6451 2.28382C9.59476 2.04617 8.50134 2.07846 7.46687 2.37769C6.43239 2.67691 5.49057 3.23331 4.72929 3.99497L1.44263 7.08331M17.026 9.91664L13.7393 13.005C12.978 13.7666 12.0362 14.323 11.0017 14.6223C9.96724 14.9215 8.87383 14.9538 7.8235 14.7161C6.77316 14.4785 5.80015 13.9786 4.99525 13.2632C4.19035 12.5478 3.57979 11.6402 3.22054 10.625"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_947_45942">
                <rect
                  width="17"
                  height="17"
                  fill="white"
                  transform="translate(0.734375)"
                ></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
      {/if}

      <div class="ellipsis-menu" aria-label="More options">
        <div
          class="ellipsis-menu__container"
          on:click|stopPropagation="{toggleMenu}"
        >
          <div class="ellipsis-menu__dots">
            <span class="ellipsis-menu__dot"></span>
            <span class="ellipsis-menu__dot"></span>
            <span class="ellipsis-menu__dot"></span>
          </div>
        </div>

        <div id="menu" class="ellipsis-menu__dropdown" style="display: none;">
          {#each options as option}
            <div class="ellipsis-menu__divider"></div>
            <button
              class="ellipsis-menu__option"
              on:click="{() => {
                toggleMenu();
                option.action();
              }}">{option.text}</button
            >
          {/each}
        </div>
      </div>
    </div>
  </div>
</footer>
