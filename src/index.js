import style from "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { getDevicePixelRatio } from "./utils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

/**
 * Canvas
 **/

const canvas = document.querySelector(".webgl");

/**
 * Scene
 **/

const scene = new THREE.Scene();

/**
 * sizes
 **/

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 **/

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 2;

/**
 * Controls
 **/
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const rendererUpdate = (renderer) => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(getDevicePixelRatio());
};

const renderer = new THREE.WebGLRenderer({
  canvas,
});

rendererUpdate(renderer);

/**
 * Setup
 */
scene.add(camera);

/**
 * resize listener
 */
function resizeListener() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  rendererUpdate(renderer);
}

window.addEventListener("resize", resizeListener);

/**
 * Font
 */

const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log(" loaded:", font);
});

/**
 * Animate
 */

//const clock = new THREE.Clock();

const tick = () => {
  // use elapsed time to update properties like rotation - to keep uniform behavior on screens with high / low frame rates
  //    const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Debug - optional
 */
const gui = new dat.GUI(); // add controls with gui.add
