//created based off the Shaders tutorial by @Oren Shoham

let myShader;
let graphic;
let initMouse;
let capture;
function preload() {
  myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  graphic = createGraphics(200, 200);

  shader(myShader);

  initMouse = { x: width / 2, y: height / 2 };
  capture = createCapture(VIDEO);
  capture.hide();
}

function draw() {
  // lets map the mouseX to frequency and mouseY to amplitude
  // try playing with these to get a more or less distorted effect
  // 10 and 0.25 are just magic numbers that I thought looked good

  graphic.image(capture, 0, 0, graphic.width, graphic.height);

  myShader.setUniform("time", frameCount * 0.2);
  myShader.setUniform("tex", graphic);

  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
