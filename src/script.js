import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const circle = new THREE.Object3D();
const skelet = new THREE.Object3D();
const particle = new THREE.Object3D();

// Objects
const particleGeometry = new THREE.TetrahedronGeometry(2, 1);
const circleGeometry = new THREE.IcosahedronGeometry(7, 1);
const skeletGeometry = new THREE.IcosahedronGeometry(15, 4);

// Materials
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shading: THREE.FlatShading,
});
const skeletMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
});

// Mesh
// const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);
for (let i = 0; i < 2000; i++) {
  const mesh = new THREE.Mesh(particleGeometry, material);
  mesh.position.set(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  );
  mesh.position.multiplyScalar(90 + Math.random() * 700);
  mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
  particle.add(mesh);
}

const innerPlanet = new THREE.Mesh(circleGeometry, material);
innerPlanet.scale.x = innerPlanet.scale.y = innerPlanet.scale.z = 16;
circle.add(innerPlanet);

const outterPlanet = new THREE.Mesh(skeletGeometry, skeletMaterial);
outterPlanet.scale.x = outterPlanet.scale.y = outterPlanet.scale.z = 10;
skelet.add(outterPlanet);

scene.add(circle);
scene.add(skelet);
scene.add(particle);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x999999);
scene.add(ambientLight);

const dLight = [];
dLight[0] = new THREE.DirectionalLight(0xffffff, 1);
dLight[0].position.set(1, 0, 0);
dLight[1] = new THREE.DirectionalLight(0x00dbde, 1);
dLight[1].position.set(0.75, 1, 0.5);
dLight[2] = new THREE.DirectionalLight(0xfc00ff, 1);
dLight[2].position.set(-0.75, -1, 0.5);
scene.add(dLight[0]);
scene.add(dLight[1]);
scene.add(dLight[2]);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 400;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

let y = 0;
const onMouseWheel = (event) => {
  y = event.deltaY * 0.003;
};
window.addEventListener("wheel", onMouseWheel);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  particle.rotation.y -= 0.0004;
  particle.rotation.z -= 0.0002;

  //   circle.rotation.x -= 0.003;
  circle.rotation.y = y / 2;

  //   skelet.rotation.x -= 0.004;
  skelet.rotation.y = -y / 10;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
