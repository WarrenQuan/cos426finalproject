/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
// import {
//     WebGLRenderer,
//     OrthographicCamera,
//     THREE,
//     Vector3,
//     Scene,
//     Mesh,
//     BoxGeometry,
//     MeshBasicMaterial,
//     TextureLoader,
//     PlaneGeometry,
//     RepeatWrapping,
//     sRGBEncoding,
//     DoubleSide,
//     Plane,
//     Audio,
//     AudioListener,
//     AudioLoader,
// } from 'three';
import { WebGLRenderer, PerspectiveCamera, Vector3, OrthographicCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

// Initialize core ThreeJS components
const scene = new SeedScene();
//const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// makes the camera top down (Orthographic Camera)
const camera = new OrthographicCamera(
    window.innerWidth / -140,
    window.innerWidth / 140,
    window.innerHeight / 140,
    window.innerHeight / -140,
    0,
    1000
);


// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the initial position and orientation of the camera
camera.position.set(0, 5, 14); // angled to like legend of zelda
// can use lookAt to follow player position too
camera.lookAt(0, 0, 0);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);