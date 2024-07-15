import type { Harmonograph } from "./model/Harmonograph";
import {
  getDefaultHarmonograph,
  harmonographToString,
  sanatizeValue,
  stringToHarmonograph,
} from "./model/Harmonograph";

import type { ToastMessage } from "./model/Messages";

import {
  EventMessages,
  PluginMessages,
  ClientStorageMessages,
  ToastMessages,
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

const notifyUI = (toastMessage: ToastMessage) => {
  figma.notify(toastMessage.message, { error: toastMessage.isError });
};

figma.ui.onmessage = (msg) => {
  console.log(msg.type);
  switch (msg.type) {
    case PluginMessages.errorMessage:
      figma.notify(msg.message, {
        timeout: 10000,
      });
      break;
    case PluginMessages.loadHarmonograph:
      {
        const selection = figma.currentPage.selection;

        if (selection.length === 0) {
          notifyUI(ToastMessages.loadingFailure);
        } else if (selection.length > 0) {
          const filteredHarmonographs: Harmonograph[] = selection
            .map((node) =>
              stringToHarmonograph(
                node.getPluginData(ClientStorageMessages.selectedHarmonograph),
              ),
            )
            .filter(
              (harmonograph): harmonograph is Harmonograph =>
                harmonograph !== null,
            );

          if (filteredHarmonographs.length <= 0 && selection.length === 1) {
            notifyUI(ToastMessages.loadingFailure);
          } else if (filteredHarmonographs.length <= 0) {
            notifyUI(ToastMessages.loadingMultiSelectFail);
          } else {
            const harmonograph = filteredHarmonographs.reduce(
              (accHarmonograph, harmonograph) => {
                for (let harmonographKey in harmonograph) {
                  let key = harmonographKey as keyof Harmonograph;

                  if (accHarmonograph[key]) {
                    accHarmonograph[key] += harmonograph[key];
                  } else {
                    accHarmonograph[key] = harmonograph[key];
                  }
                }

                return accHarmonograph;
              },
              {} as Harmonograph,
            );

            for (let key in harmonograph) {
              let value = harmonograph[key as keyof Harmonograph];
              harmonograph[key as keyof Harmonograph] = sanatizeValue(
                key,
                value / filteredHarmonographs.length,
              );
            }

            if (filteredHarmonographs.length > 1) {
              notifyUI(ToastMessages.loadingMultiSelect);
            }

            figma.ui.postMessage({
              type: EventMessages.loadHarmonograph,
              harmonograph,
            });
          }
        }
      }

      break;
    case PluginMessages.insertHarmonograph:
      const nodes = [];
      var harmonograph = msg.harmonograph;
      var svgContent = msg.svgContent;

      var height = harmonograph.r * 2;
      var width = harmonograph.r * 2;

      var harmonographDetails = harmonographToString(harmonograph);

      var svgNode = figma.createNodeFromSvg(svgContent);

      const harmonographDate = new Date();

      svgNode.name = `harmonograph - ${harmonographDate.toLocaleString(undefined)}`;
      svgNode.x = Math.floor(figma.viewport.center.x - width / 2);
      svgNode.y = Math.floor(figma.viewport.center.y - height / 2);
      svgNode.setPluginData(
        ClientStorageMessages.selectedHarmonograph,
        harmonographDetails,
      );
      svgNode.children[0].setPluginData(
        ClientStorageMessages.selectedHarmonograph,
        harmonographDetails,
      );

      nodes.push(svgNode);

      figma.currentPage.appendChild(svgNode);
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);

      figma.closePlugin();

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
