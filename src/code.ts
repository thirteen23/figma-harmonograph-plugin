import { Harmonograph } from "./Harmonograph";

figma.showUI(__html__, { themeColors: true, width: 335, height: 800 });

figma.clientStorage.getAsync("last-harmonograph").then((last) => {
  console.log("last one made is this one: ", last);
  if (last === undefined) {
    console.log("sending default one");

    let harmonograph: Harmonograph = {
      d: 900,
      c: 800,
      p: 900,
      q: 700,
      r: 300,
      A: 10, // Convert to radians later
      B: 10, // Convert to radians later
      u: 0,
      v: 0,
      R: 0.001,
      S: 0.001,
      f: 0.3,
      g: 0.302,
      h: 0.0008,
      w: 0.2,
      diameter: 320,
      steps: 900,
      segments: 32,
    };

    figma.ui.postMessage({ type: "update-harmonograph", harmonograph });
  }
});

// TODO pull list of saved harmonographs
// TODO send last edited harmonograph
// figma.ui.postMessage("");

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "insert-harmonograph":
      const nodes = [];
      var harmonograph = msg.harmonograph;

      var height = harmonograph.r;
      var width = harmonograph.r;
      var stroke = harmonograph.w;
      var scale = 0.5;
      var data = msg.data;
      var svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${data}" stroke="black" stroke-width="${stroke}" stroke-linecap="round" transform="scale(${scale}, ${scale}) translate(${width}, ${height})"/>
        </svg>`;

      var svgNode = figma.createNodeFromSvg(svg);
      figma.currentPage.appendChild(svgNode);
      nodes.push(svgNode);
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);

      figma.closePlugin();

      break;
    case "resize-window":
      figma.ui.resize(msg.size.w, msg.size.h);
  }
};
