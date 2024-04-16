/*
Assignment 1 for It's Shader Time

Student: Nima Niazi

Description: The user can control the speed of rotation using the number keys on their keyboard, 0 being the slowest and 9 the fastest;
*/

let angle = 0;
let rotation_speed = 0.01;
const color_rate = 0.5;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  colorMode(HSB);
}

function draw() {
  background(220);

  rotateX(angle);
  rotateY(angle * 0.3);

  let hue1 = (frameCount * color_rate) % 360;
  let hue2 = (frameCount * color_rate + 120) % 360;
  let hue3 = (frameCount * color_rate + 240) % 360;

  let color1 = color(hue1, 100, 100);
  let color2 = color(hue2, 100, 100);
  let color3 = color(hue3, 100, 100);

  noStroke();
  beginShape(TRIANGLES);

  fill(color1);
  vertex(-100, -100, 0);

  fill(color2);
  vertex(100, -100, 0);

  fill(color3);
  vertex(0, 100, 0);

  endShape();

  angle += rotation_speed;
}

function keyPressed() {
  if (key >= "0" && key <= "9") {
    let speed = map(parseInt(key), 0, 9, 0.001, 0.05);
    rotation_speed = speed;
  }
}
