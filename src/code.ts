import { Harmonograph } from "./Harmonograph";
import { inputRanges } from "./HarmonographParams";

figma.showUI(__html__, { themeColors: true, width: 500, height: 800 });

figma.clientStorage.getAsync("last-harmonograph").then((last) => {
  console.log("last one made is this one: ", last);
  if (last === undefined) {
    console.log("sending default one");

    // TODO get default from HarmonographParams - get default inputs once it returns a Harmonograph
    let harmonograph: Harmonograph = {
      d: inputRanges.d.default,
      c: inputRanges.c.default,
      p: inputRanges.p.default,
      q: inputRanges.q.default,
      r: inputRanges.r.default,
      A: inputRanges.A.default, // Convert to radians later
      B: inputRanges.B.default, // Convert to radians later
      u: inputRanges.u.default,
      v: inputRanges.v.default,
      R: inputRanges.R.default,
      S: inputRanges.S.default,
      f: inputRanges.f.default,
      g: inputRanges.g.default,
      h: inputRanges.h.default,
      w: inputRanges.w.default,
      steps: inputRanges.steps.default,
      segments: inputRanges.segments.default,
    };

    figma.ui.postMessage({ type: "update-harmonograph", harmonograph });
  }
});

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
