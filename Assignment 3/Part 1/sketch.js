// Vertex Shader
const vertexShader = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  varying vec2 vTexCoord;

  void main() {

    vTexCoord = aTexCoord;

vec4 position = vec4(aPosition, 1.0);

    position.xy = position.xy * 2.0 - 1.0;

    gl_Position = position;
  }
`;

// Fragment Shader
const fragmentShader = `
  precision highp float;

  varying vec2 vTexCoord;

  uniform vec2 uTileSize;
  uniform vec2 uScreenSize;

  // Function to generate a unique pattern for each tile
  float getTilePattern(vec2 tilePos) {
    float pattern = 0.0;
    pattern += sin(tilePos.x * 10.0) * 0.5 + 0.5;
    pattern += cos(tilePos.y * 10.0) * 0.5 + 0.5;
    pattern *= 0.5;
    return pattern;
  }
  vec3 randomColor(float seed) {
    return vec3(fract(sin(seed * 43758.5453)) * 0.5 + 0.5,
                fract(cos(seed * 75430.3542)) * 0.5 + 0.5,
                fract(tan(seed * 14157.4731)) * 0.5 + 0.5);
  }
  void main() {
    vec2 fragmentCoord = vTexCoord * uScreenSize;
    float numCols = floor(uScreenSize.x / uTileSize.x);
    float numRows = floor(uScreenSize.y / uTileSize.y);
    float tileIndexX = floor(fragmentCoord.x / uTileSize.x);
    float tileIndexY = floor(fragmentCoord.y / uTileSize.y);
    vec2 tileCenter = (vec2(tileIndexX, tileIndexY) + 0.5) * uTileSize;
    float x = abs((fragmentCoord.x - tileCenter.x) / uScreenSize.x * 10.0);
    float y = abs((fragmentCoord.y - tileCenter.y) / uScreenSize.y * 10.0);
    float pattern = max(x, y);

    vec2 tileOffset = fragmentCoord - vec2(tileIndexX, tileIndexY) * uTileSize;

    float seed = tileIndexX + tileIndexY * numCols + tileOffset.x + tileOffset.y;

    pattern *= getTilePattern(vec2(tileIndexX, tileIndexY));
    vec3 fragmentColor = randomColor(seed);

    gl_FragColor = vec4(pattern * fragmentColor.x, pattern * fragmentColor.y, pattern, 1.0);
  }
`;

let shader_one;

function preload() {
  shader_one = createShader(vertexShader, fragmentShader);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(0);

  shader(shader_one);
  shader_one.setUniform("uTileSize", [50, 50]);
  shader_one.setUniform("uScreenSize", [width, height]);

  rect(0, 0, width, height);
}
