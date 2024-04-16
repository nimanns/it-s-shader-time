#ifdef GL_ES
precision mediump float;
#endif


varying vec2 vUV;
uniform sampler2D tex;
uniform float time;

void main() {
  vec2 texCoordFlip = vec2(1.0) - vUV;
  vec4 captureCol = texture2D(tex, texCoordFlip);

  
    vec4 texColor = texture2D(tex, vUV);

    vec3 shiftedColor = vec3(
        captureCol.r + sin(vUV.x * 3.14 + time) * 0.1,
        captureCol.g + sin(vUV.y * 2.14 + time * 0.5) * 0.5,
        captureCol.b + cos(vUV.x * vUV.y * 3.14 + time * 0.25) * 0.5
    );

    gl_FragColor = vec4(shiftedColor, captureCol.a);
}