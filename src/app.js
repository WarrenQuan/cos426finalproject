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
import { WebGLRenderer, PerspectiveCamera, Vector3, OrthographicCamera, TextGeometry, FontLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { SeedScene } from 'scenes';
require('./assets/letters/a.jpg')
require('./assets/letters/b.jpg')
require('./assets/letters/c.jpg')
require('./assets/letters/d.jpg')
require('./assets/letters/e.jpg')
require('./assets/letters/f.jpg')
require('./assets/letters/g.jpg')
require('./assets/letters/h.jpg')
require('./assets/letters/i.jpg')
require('./assets/letters/j.jpg')
require('./assets/letters/k.jpg')
require('./assets/letters/l.jpg')
require('./assets/letters/m.jpg')
require('./assets/letters/n.jpg')
require('./assets/letters/o.jpg')
require('./assets/letters/p.jpg')
require('./assets/letters/q.jpg')
require('./assets/letters/r.jpg')
require('./assets/letters/s.jpg')
require('./assets/letters/t.jpg')
require('./assets/letters/u.jpg')
require('./assets/letters/v.jpg')
require('./assets/letters/w.jpg')
require('./assets/letters/x.jpg')
require('./assets/letters/y.jpg')
require('./assets/letters/z.jpg')
require('./assets/glass.png')


require('./sounds/dungeon.mp3');
require('./sounds/Old Nassau - 2020 Virtual Commencement.mp3');

import { Scenes } from 'scenes';
Scenes.create();

// // Initialize core ThreeJS components
// const scene = new SeedScene();
// //const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

//makes the camera top down (Orthographic Camera)
const camera = new OrthographicCamera(
    window.innerWidth / -140,
    window.innerWidth / 140,
    window.innerHeight / 140,
    window.innerHeight / -140,
    0,
    1000
);

// import { Scenes } from 'src/components/scenes';
// Scenes.create();

// Set up renderer, canvas, and minor CSS adjustments
Scenes.renderer.setPixelRatio(window.devicePixelRatio);
const canvas = Scenes.renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Set the initial position and orientation of the camera
// camera.position.set(0, 5, 14); // angled to like legend of zelda
// // can use lookAt to follow player position too
// camera.lookAt(0, 0, 0);

//Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    Scenes.renderer.render(Scenes.currentScene, Scenes.currentScene.camera);
    // scene.update && scene.update(timeStamp);
    Scenes.currentScene.update && Scenes.currentScene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// // Resize Handler
// const windowResizeHandler = () => {
//     const { innerHeight, innerWidth } = window;
//     renderer.setSize(innerWidth, innerHeight);
//     camera.aspect = innerWidth / innerHeight;
//     camera.updateProjectionMatrix();
    
// };
// windowResizeHandler();
// window.addEventListener('resize', windowResizeHandler, false);
