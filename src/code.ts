import type { Harmonograph } from "./Harmonograph";
import { createSVGString, getDefaultHarmonograph } from "./Harmonograph";
import { EventMessages, PluginMessages, ClientStorageMessages } from "./Messages";

figma.showUI(__html__, { themeColors: true, width: 400, height: 800 });

// Load if user is returning
figma.clientStorage.getAsync(ClientStorageMessages.returningUser).then((returningUser) => {
  let page = returningUser === undefined ? 1 : 0;
      
  figma.clientStorage.getAsync(ClientStorageMessages.lastHarmonograph).then((savedHarmonograph) => {
    console.log("Loaded last inserted harmonograph: ", savedHarmonograph);
  
    let harmonograph: Harmonograph = savedHarmonograph ?? getDefaultHarmonograph();
  
    figma.ui.postMessage({ type: EventMessages.loadState, harmonograph, page });
  });
});


figma.ui.onmessage = (msg) => {
  console.log(msg.type);
  switch (msg.type) {
    case  PluginMessages.insertHarmonograph:
      const nodes = [];
      var harmonograph = msg.harmonograph;

      let svg = createSVGString(harmonograph);
      var svgNode = figma.createNodeFromSvg(svg);
      figma.currentPage.appendChild(svgNode);
      nodes.push(svgNode);

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
      figma.closePlugin();
      break;
    case PluginMessages.saveHarmonograph:
      var harmonograph = msg.harmonograph;
      figma.clientStorage.setAsync(ClientStorageMessages.lastHarmonograph, harmonograph);

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
