// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { themeColors: true, width: 350, height: 800 });

var d = 900;
var c = 800;
var p = 900;
var q = 700;
var r = 300;
var A = 10; // convert toRadians
var B = 10; // convert toRadians
var u = 0;
var v = 0;
var R = 0.001;
var S = 0.001;
var f = 0.3;
var g = 0.302;
var h = 0.0008;
var w = 0.2;

var scale = 1;
var pathData = "";

var diameter = 320;
var steps = 320;
var segments = 32;

function getXY(t) {
  var alpha =
    toRadians(A) *
    Math.sin(2.0 * Math.PI * (f * t + parseFloat(u))) *
    Math.exp(-R * t);
  var beta =
    toRadians(B) *
    Math.sin(2.0 * Math.PI * (g * t + parseFloat(v))) *
    Math.exp(-S * t);
  var gamma = 2.0 * Math.PI * h * t;

  var xa = p * Math.cos(alpha) + q * Math.sin(alpha) - d;
  var ya = q * Math.cos(alpha) - p * Math.sin(alpha);
  var xb = xa * Math.cos(beta) - ya * Math.sin(beta);
  var yb = ya * Math.cos(beta) + xa * Math.sin(beta) - c;
  var x = xb * Math.cos(gamma) - yb * Math.sin(gamma);
  var y = yb * Math.cos(gamma) + xb * Math.sin(gamma);

  console.log("time: ", t, " x: ", x, " y: ", y);

  return { x: x, y: y };
}

function createPathData() {
  var startCoords = getXY(0);
  console.log("start coords: ", startCoords);
  var xs = [startCoords.x];
  var ys = [startCoords.y];

  var t = 0;

  for (var i = 0; i < steps; ++i) {
    for (var j = 0; j < segments; ++j) {
      t += 0.1;
      var coords = getXY(t);
      xs.push(coords.x);
      ys.push(coords.y);
    }
  }

  var n = xs.length;
  var factor = 0.5 / 3;
  var rxs = [];
  var rys = [];
  var cxs = [];
  var cys = [];

  for (var i = 0; i < n; i += 1) {
    var prev = Math.max(0, i - 1);
    var next = Math.min(n - 1, i + 1);
    rxs.push(xs[i]);
    rys.push(ys[i]);
    cxs.push(factor * (xs[next] - xs[prev]));
    cys.push(factor * (ys[next] - ys[prev]));
  }

  var rn = rxs.length;

  var data = [
    "M",
    round(rxs[0]),
    round(rys[0]),
    "C",
    round(rxs[0] + cxs[0]),
    round(rys[0] + cys[0]) + ",",
    round(rxs[1] - cxs[1]),
    round(rys[1] - cys[1]) + ",",
    round(rxs[1]),
    round(rys[1]),
  ];

  if (rn > 2) {
    data.push("S");
    for (var i = 2; i < rn; i++) {
      data.push(round(rxs[i] - cxs[i]));
      data.push(round(rys[i] - cys[i]) + ",");
      data.push(round(rxs[i]));
      data.push(round(rys[i]));
    }
  }

  return data;
}

function round(x) {
  return Math.round(x * 1000) / 1000;
}

function toRadians(degrees) {
  return (degrees / 180.0) * Math.PI;
}

figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-harmonograph") {
    const nodes: SceneNode[] = [];

    var height = r;
    var width = r;
    var scale = 0.5;
    var data = msg.data;

    var svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="${data}" stroke="black" stroke-width="${msg.stroke}" stroke-linecap="round" transform="scale(${scale}, ${scale}) translate(${width}, ${height})"/>
    </svg>`
  
    var svgNode = figma.createNodeFromSvg(svg);

    figma.currentPage.appendChild(svgNode);
    nodes.push(svgNode);

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
