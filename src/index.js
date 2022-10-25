import style from "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { getDevicePixelRatio } from "./utils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Debug - optional
 */
const gui = new dat.GUI(); // add controls with gui.add

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
camera.position.y = 0;
camera.position.z = 6;

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load("/matcaps/1.png");
const matcapTexture2 = textureLoader.load("/matcaps/2.png");
const matcapTexture3 = textureLoader.load("/matcaps/3.png");
const matcapTexture7 = textureLoader.load("/matcaps/7.png");
const matcapTexture5 = textureLoader.load("/matcaps/5.png");

/**
 * Font
 */
let textMaterial;
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("You are a worm through time", {
    font: font,
    size: 0.6,
    height: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 6,
  });
  textGeometry.computeBoundingBox(); // creates a bounding box around text geometry
  textGeometry.translate(
    -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    -(textGeometry.boundingBox.max.z - 0.02) * 0.5
  );
  textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture1,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  console.log("text :", text);
  scene.add(text);
  gui.add(textMaterial, "matcap", {
    matcap1: matcapTexture1,
    matcap2: matcapTexture2,
    matcap3: matcapTexture3,
    matcap7: matcapTexture7,
    matcap5: matcapTexture5,
  });
});

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const coneGeometry = new THREE.ConeGeometry(11, 11, 1);
const knotGeometry = new THREE.TorusKnotGeometry(0.5, 0.4, 42, 9);
const sphereGeometry = new THREE.SphereGeometry(0.5, 24, 18);

const matcap1Material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture1,
});
const matcap2Material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture2,
});
const matcap3Material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture3,
});
const matcap7Material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture7,
});
const matcap5Material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture5,
});

const getMeshGeometry = (i) => {
  switch (true) {
    case i % 7 === 0:
      return donutGeometry;
    case i % 5 === 0:
      return boxGeometry;
    case i % 3 === 0:
      return knotGeometry;
    case i % 2 === 0:
      return coneGeometry;
    default:
      return sphereGeometry;
  }
};

const getMeshMaterial = (i) => {
  switch (true) {
    case i % 4 === 0:
      return matcap5Material;
    case i % 6 === 0:
      return matcap7Material;
    case i % 10 === 0:
      return matcap3Material;
    case i % 9 === 0:
      return matcap2Material;
    default:
      return matcap1Material;
  }
};

for (let i = 0; i < 100; i++) {
  const mesh = new THREE.Mesh(getMeshGeometry(i), getMeshMaterial(i));
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  const scale = Math.max(Math.random(), 0.3);
  mesh.scale.set(scale, scale, scale);
  scene.add(mesh);
}
/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  // use elapsed time to update properties like rotation - to keep uniform behavior on screens with high / low frame rates
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  scene.traverse((object) => {
    if (object.isMesh === true && object.geometry.type !== "TextGeometry") {
      object.rotation.x = elapsedTime;
      object.rotation.y = elapsedTime * 2;
    }
  });
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
