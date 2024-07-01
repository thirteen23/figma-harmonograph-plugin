import type { Harmonograph } from "./Harmonograph";
import { getDefaultHarmonograph } from "./Harmonograph";

import {
  EventMessages,
  PluginMessages,
  ClientStorageMessages,
} from "./Messages";

figma.showUI(__html__, { themeColors: true, width: 400, height: 800 });

figma.clientStorage
  .getAsync(ClientStorageMessages.returningUser)
  .then((returningUser) => {
    let page = returningUser === undefined ? 1 : 0;

    figma.clientStorage
      .getAsync(ClientStorageMessages.lastHarmonograph)
      .then((savedHarmonograph) => {
        console.log("Loaded last inserted harmonograph: ", savedHarmonograph);

        let harmonograph: Harmonograph =
          savedHarmonograph ?? getDefaultHarmonograph();

        figma.ui.postMessage({
          type: EventMessages.loadState,
          harmonograph,
          page,
        });
      });
  });

figma.ui.onmessage = (msg) => {
  console.log(msg.type);
  switch (msg.type) {
    case PluginMessages.insertHarmonograph:
      const nodes = [];
      var harmonograph = msg.harmonograph;
      var data = msg.pathData;

      var height = harmonograph.r;
      var width = harmonograph.r;
      var stroke = harmonograph.w;
      var scale = 0.5;

      var svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${data}" stroke="black" stroke-width="${stroke}" stroke-linecap="round" transform="scale(${scale}, ${scale}) translate(${width}, ${height})"/>
        </svg>`;

      var svgNode = figma.createNodeFromSvg(svg);
      svgNode.name = "harmonograph";
      svgNode.x = Math.floor(figma.viewport.center.x - width / 2);
      svgNode.y = Math.floor(figma.viewport.center.y - height / 2);

      figma.currentPage.appendChild(svgNode);
      nodes.push(svgNode);

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
      const windowHeight = Math.max(700, Math.floor(msg.height));
      figma.ui.resize(400, windowHeight);
      break;
    case PluginMessages.FTUEVisited:
      figma.clientStorage.setAsync(ClientStorageMessages.returningUser, true);
      break;
  }
};
