import type { Harmonograph } from "./model/Harmonograph";
import { getDefaultHarmonograph } from "./model/Harmonograph";

import {
  EventMessages,
  PluginMessages,
  ClientStorageMessages,
} from "./model/Messages";

const PLUGIN_DEFAULT_WIDTH = 500;
const PLUGIN_MIN_WIDTH = 400;

const PLUGIN_DEFAULT_HEIGHT = 800;
const PLUGIN_MIN_HEIGHT = 700;

let userSettings = {
  ftueVisited: false,
  advancedMode: false,
  uiHeight: PLUGIN_DEFAULT_HEIGHT,
  uiWidth: PLUGIN_DEFAULT_WIDTH,
};

figma.clientStorage
  .getAsync(ClientStorageMessages.userSettings)
  .then((returningUserInfo) => {
    console.log("Loaded user info: ", JSON.stringify(returningUserInfo));

    if (returningUserInfo !== undefined) {
      userSettings = returningUserInfo;
    }

    console.log("User info: ", JSON.stringify(userSettings));

    let ftueVisited = userSettings.ftueVisited;
    let height = userSettings.uiHeight;
    let width = userSettings.uiWidth;
    let advancedMode = userSettings.advancedMode ?? false;

    figma.showUI(__html__, {
      themeColors: true,
      width,
      height,
    });

    figma.clientStorage
      .getAsync(ClientStorageMessages.lastHarmonograph)
      .then((savedHarmonograph) => {
        console.log("Loaded last inserted harmonograph: ", savedHarmonograph);

        let harmonograph: Harmonograph =
          savedHarmonograph ?? getDefaultHarmonograph();

        figma.ui.postMessage({
          type: EventMessages.loadState,
          harmonograph,
          ftueVisited,
          advancedMode,
        });
      });
  });

figma.ui.onmessage = (msg) => {
  console.log(msg.type);
  switch (msg.type) {
    case PluginMessages.errorMessage:
      figma.notify(msg.message, {
        timeout: 10000,
      });
      break;
    case PluginMessages.insertHarmonograph:
      const nodes = [];
      var harmonograph = msg.harmonograph;
      var svgContent = msg.svgContent;

      var height = harmonograph.r * 2;
      var width = harmonograph.r * 2;

      var svg = `
          <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            ${svgContent}
          </svg>`;

      var svgNode = figma.createNodeFromSvg(svg);
      svgNode.name = "harmonograph";
      svgNode.x = Math.floor(figma.viewport.center.x - width / 2);
      svgNode.y = Math.floor(figma.viewport.center.y - height / 2);

      figma.currentPage.appendChild(svgNode);
      nodes.push(svgNode);

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);

      break;
    case PluginMessages.saveHarmonograph:
      var harmonograph = msg.harmonograph;
      figma.clientStorage.setAsync(
        ClientStorageMessages.lastHarmonograph,
        harmonograph,
      );

      break;
    case PluginMessages.resizeWindow:
      let newWidth = msg.width ?? userSettings.uiWidth;
      let newHeight = msg.height ?? userSettings.uiHeight;

      userSettings.uiWidth = Math.max(PLUGIN_MIN_WIDTH, Math.floor(newWidth));
      userSettings.uiHeight = Math.max(
        PLUGIN_MIN_HEIGHT,
        Math.floor(newHeight),
      );

      figma.clientStorage.setAsync(
        ClientStorageMessages.userSettings,
        userSettings,
      );

      figma.ui.resize(userSettings.uiWidth, userSettings.uiHeight);
      break;
    case PluginMessages.FTUEVisited:
      userSettings.ftueVisited = true;
      figma.clientStorage.setAsync(
        ClientStorageMessages.userSettings,
        userSettings,
      );
      break;
    case PluginMessages.updateAdvancedMode:
      let isAdvanced = msg.advancedMode ?? false;
      console.log("setting advanced mode?: ", msg.advancedMode);
      userSettings.advancedMode = isAdvanced;
      figma.clientStorage.setAsync(
        ClientStorageMessages.userSettings,
        userSettings,
      );
  }
};
