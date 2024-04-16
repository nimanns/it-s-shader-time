import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const blurbGeometry = new THREE.BufferGeometry();
const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);

const blurbVertices = [];
const blurbIndices = [];

const width = 4;
const height = 4;
const resolution = 32;

for (let y = 0; y <= resolution; y++) {
  for (let x = 0; x <= resolution; x++) {
    const u = x / resolution;
    const v = y / resolution;
    const px = (u - 0.5) * width;
    const py = (v - 0.5) * height;
    const pz = Math.sin(u * Math.PI * 4) * Math.cos(v * Math.PI * 4) * 0.5;

    blurbVertices.push(px, py, pz);

    if (x < resolution && y < resolution) {
      const a = x + y * (resolution + 1);
      const b = (x + 1) + y * (resolution + 1);
      const c = (x + 1) + (y + 1) * (resolution + 1);
      const d = x + (y + 1) * (resolution + 1);

      blurbIndices.push(a, b, d);
      blurbIndices.push(b, c, d);
    }
  }
}

blurbGeometry.setIndex(blurbIndices);
blurbGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(blurbVertices), 3));

const vertexShader = `
  uniform float time;
  uniform float amplitude;
  uniform float frequency;
  uniform float distortion;
  uniform float oscillationFrequency;
  uniform int shapeIndex;

  void main() {
    vec3 newPosition = position;

    if (shapeIndex == 0) {
      newPosition.z += amplitude * sin(newPosition.x * frequency + time) * (1.0 + distortion * sin(newPosition.x * oscillationFrequency + time));
    } else {
      newPosition *= 1.0 + amplitude * sin(newPosition.x * frequency + time) * (1.0 + distortion * sin(newPosition.y * oscillationFrequency + time));
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float distortion;
  uniform int shapeIndex;

  void main() {
    vec2 uv = gl_FragCoord.xy / vec2(1024.0, 768.0);
    vec3 color = vec3(
      0.5 + 0.5 * sin(uv.x * 10.0 + time * 2.0),
      0.5 + 0.5 * sin(uv.y * 10.0 + time * 2.0),
      0.5 + 0.5 * sin((uv.x + uv.y) * 10.0 + time * 2.0)
    );

    if (shapeIndex == 0) {
      color *= 1.0 + distortion * sin(uv.x * 20.0 + time * 4.0);
    } else {
      color *= 1.0 + distortion * sin(uv.y * 20.0 + time * 4.0);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    time: { value: 0 },
    amplitude: { value: 1.0 },
    frequency: { value: 2.0 },
    distortion: { value: 0.5 },
    oscillationFrequency: { value: 10.0 },
    shapeIndex: { value: 0 },
  },
});

const blurbMesh = new THREE.Mesh(blurbGeometry, material);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.set(0, 0, 0);

scene.add(blurbMesh);
scene.add(sphereMesh);

const controls = new OrbitControls(camera, renderer.domElement);

const gui = new GUI();
const params = {
  amplitude: 1.0,
  frequency: 2.0,
  distortion: 0.5,
  oscillationFrequency: 10.0,
  shapeIndex: 0,
};

gui.add(params, 'amplitude', 0.0, 2.0).onChange((value) => {
  material.uniforms.amplitude.value = value;
});

gui.add(params, 'frequency', 0.0, 10.0).onChange((value) => {
  material.uniforms.frequency.value = value;
});

gui.add(params, 'distortion', 0.0, 1.0).onChange((value) => {
  material.uniforms.distortion.value = value;
});

gui.add(params, 'oscillationFrequency', 0.0, 50.0).onChange((value) => {
  material.uniforms.oscillationFrequency.value = value;
});

gui.add(params, 'shapeIndex', { Blurb: 0, Sphere: 1 }).onChange((value) => {
  material.uniforms.shapeIndex.value = value;
});

function animate() {
  requestAnimationFrame(animate);

  material.uniforms.time.value += 0.01;

  blurbMesh.rotation.x += 0.01;
  blurbMesh.rotation.y += 0.01;
  sphereMesh.rotation.x += 0.01;
  sphereMesh.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();