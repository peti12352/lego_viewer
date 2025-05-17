import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls;
let initialAutoRotate = false; // Flag to manage initial auto-rotation

export function initViewer() {
  const viewerContainer = document.getElementById("viewerContainer");
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdedede);

  const aspect = viewerContainer.clientWidth / viewerContainer.clientHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 1, 20000);
  camera.position.set(150, 200, 250);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
  viewerContainer.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight1.position.set(1, 1, 1).normalize();
  scene.add(directionalLight1);
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, -1, -0.5).normalize();
  scene.add(directionalLight2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = true;
  controls.minDistance = 10;
  controls.maxDistance = 10000;
  controls.target.set(0, 50, 0);

  // Set camera orbital angle limits for unconstrained viewing around the target
  controls.minPolarAngle = 0; // Default is 0 (looking from top)
  controls.maxPolarAngle = Math.PI; // Default is Math.PI (looking from bottom) - ensures full vertical rotation
  controls.minAzimuthAngle = -Infinity; // Default is -Infinity - ensures full horizontal rotation
  controls.maxAzimuthAngle = Infinity; // Default is Infinity - ensures full horizontal rotation

  // Auto-rotation setup
  controls.autoRotate = false; // Start with it off, will be enabled on model load
  controls.autoRotateSpeed = 0.5;

  // Stop auto-rotation on user interaction
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    initialAutoRotate = false; // Ensure it doesn't restart if we re-enable later
  });

  controls.update();

  window.addEventListener("resize", onWindowResize);
  onWindowResize();
  animate();
}

function onWindowResize() {
  const viewerContainer = document.getElementById("viewerContainer");
  const newWidth = viewerContainer.clientWidth;
  const newHeight = viewerContainer.clientHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) {
    if (initialAutoRotate && controls.autoRotate) {
      // Let autoRotate do its thing until first interaction handled by 'start' event
    }
    controls.update();
  }
  if (renderer && scene && camera) renderer.render(scene, camera);
}

// Function to fit model to view
export function frameArea(
  object,
  camera,
  controls,
  viewerDomElement,
  enableAutoRotate = false
) {
  if (!object) return;

  initialAutoRotate = enableAutoRotate;
  controls.autoRotate = enableAutoRotate;

  const boundingBox = new THREE.Box3().setFromObject(object);
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());

  // Calculate the maximum dimension of the bounding box
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  // Add some padding so the model is not edge to edge
  cameraZ *= 1.5;

  // Adjust for aspect ratio to ensure the model fits in the smaller dimension
  const aspect = viewerDomElement.clientWidth / viewerDomElement.clientHeight;
  if (aspect < 1) {
    // Portrait or square
    cameraZ /= aspect;
  }

  controls.target.copy(center);

  // Position the camera and make it look at the center of the object
  // We can set a default direction, e.g., from a slight angle
  const direction = new THREE.Vector3(0.5, 0.4, 1).normalize(); // Default viewing direction
  const newPosition = new THREE.Vector3()
    .copy(center)
    .add(direction.multiplyScalar(cameraZ));
  camera.position.copy(newPosition);

  camera.near = cameraZ / 100; // Adjust near and far planes
  camera.far = cameraZ * 100;
  camera.updateProjectionMatrix();

  controls.update();
  console.log(
    "[Viewer] Framed model. Target:",
    center,
    "New Cam Pos:",
    camera.position
  );
}

export function getScene() {
  return scene;
}
export function getCamera() {
  return camera;
}
export function getRenderer() {
  return renderer;
}
export function getControls() {
  return controls;
}
