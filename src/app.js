/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, OrthographicCamera, Vector3, Scene, Mesh, BoxGeometry, MeshBasicMaterial} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

// Set up the scene, camera, and renderer
const scene = new SeedScene();
const camera = new OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0,
    1000
  
);
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Set the initial position and orientation of the camera
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
// Set up the player character
var playerGeometry = new BoxGeometry(20, 20, 20);
var playerMaterial = new MeshBasicMaterial({
  color: 0xff0000,
});
var player = new Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0, 0);
scene.add(player);

// Set up the room
var roomGeometry = new BoxGeometry(500, 500, 500);
var roomMaterial = new MeshBasicMaterial({
  color: 0x12342,
  wireframe: true,
});
var room = new Mesh(roomGeometry, roomMaterial);
room.position.set(0, 0, 0);
scene.add(room);

const box = new Mesh(
    new BoxGeometry(20, 20, 20),
    new MeshBasicMaterial({ color: 0x00ff00 })
  );

// need to find some way to make multiple
// Create multiple boxes for pushing
for(var i = 1; i < 4; i++){
    for(var j = 1; j < 4; j++){
        box.position.set(40 * i, 40 * j, 0);
        scene.add(box);
    }
};

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Move the player
const speed = 15;
function onKeyDown(event) {
    console.log( player.position.y )
  if(event.keyCode == 38 && player.position.y < window.innerHeight / 2 - 10) {
    player.position.y += speed;
    moveBox("down")
  }
  if (event.keyCode == 40 && player.position.y > window.innerHeight / -2 + 10){
    player.position.y -= speed;
    moveBox("up")
  }
  if (event.keyCode == 37 && player.position.x > window.innerWidth / -2 + 10){
    player.position.x -= speed;
    moveBox("left")
  }
  if (event.keyCode == 39 && player.position.x < window.innerWidth / 2 - 10){
      player.position.x += speed;
      moveBox("right")
  }
  console.log("SPEED" + speed)
  console.log("POS X" + player.position.x)
  console.log("POS Y" + player.position.y)
}

function moveBox(direction){
    // Move the box
    const boxSpeed = 20;
    // Check for collisions between the player and the box
    const distance = player.position.distanceTo(box.position);
    // handling simple collision
    if (distance <= 20) {
        if(direction === "up")
            box.position.y -= boxSpeed;
        if(direction === "down")
            box.position.y += boxSpeed;
        if(direction === "left")
            box.position.x -= boxSpeed;
        if(direction === "right")
            box.position.x += boxSpeed;
    }
}

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    window.addEventListener('keydown', onKeyDown, true);
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
