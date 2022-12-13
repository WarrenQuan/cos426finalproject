/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
// CAN AND SHOULD TRY TO MODULARIZE SOME OF THE CODE
import { WebGLRenderer, OrthographicCamera, Vector3, Scene, Mesh, BoxGeometry, MeshBasicMaterial, TextureLoader, PlaneGeometry, RepeatWrapping, sRGBEncoding, DoubleSide, Plane, } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

// Set up the scene, camera, and renderer
const scene = new SeedScene();
// makes the camera top down (Orthographic Camera)
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
camera.position.set(0, -50, 140); // angled to like legend of zelda
// can use lookAt to follow player position too
camera.lookAt(0, 0, 0);

// -------- PLAYER CODE AND MESH ---------- // 
const playerSize = 40
const playerHeight = 100
var playerGeometry = new BoxGeometry(playerSize, playerSize, playerHeight);
var playerMaterial = new MeshBasicMaterial({
  color: 0xff0000,
    wireframe: true,
});
var player = new Mesh(playerGeometry, playerMaterial);
player.geometry.computeBoundingBox();
player.boundingBox = player.geometry.boundingBox.clone();
player.position.set(0, 0, playerHeight / 2);
scene.add(player);
// -------- PLAYER CODE AND MESH END ---------- // 

// -------- ROOM/FLOOR CODE AND MESH (JUST A PLANE) ---------- // 
// Set up the room
const roomGeometry = new PlaneGeometry( window.innerWidth - 20, window.innerHeight - 20);
const groundTexture = new TextureLoader().load('src/assets/dungeontexture.jpeg');

// ground texture
groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
groundTexture.repeat.set( 10, 10 );
groundTexture.anisotropy = 16;
groundTexture.encoding = sRGBEncoding;
var roomMaterial = new MeshBasicMaterial({
	map: groundTexture,
  side: DoubleSide
  });

const room = new Mesh(roomGeometry, roomMaterial);
room.geometry.compu
room.position.set(0, 0, 0);
scene.add(room);
room.geometry.computeBoundingBox();
room.boundingBox = room.geometry.boundingBox.clone();
// -------- ROOM/FLOOR CODE AND MESH END ---------- // 

// -------- BOXES CODE ---------- // 
let boxes = []
const boxSize = 40

// need to find some way to make multiple
// Create multiple boxes for pushing
for(var i = -3; i < 4; i++){
    for(var j = 1; j < 4; j++){
      const box = new Mesh(
        new BoxGeometry(boxSize, boxSize, boxSize),
        new MeshBasicMaterial({ color: 0x00ff00, 
        wireframe: true,})
      );
      box.geometry.computeBoundingBox();
      box.boundingBox = box.geometry.boundingBox.clone();
        box.position.set(boxSize * 2 * i, boxSize * 2 * j, 0);
        // kinda buggy
        // box.position.set(Math.floor(Math.random() * window.innerHeight) - (window.innerHeight / 2), Math.floor(Math.random() * window.innerWidth) - (window.innerWidth / 2), 0);
        scene.add(box);
        boxes.push(box)
        console.log(boxes.length)
    }
};

// -------- BOXES CODE END ---------- // 

// -- FUNCTION FOR PLAYER MOVEMENT -- //
const speed = playerSize/2;
function onKeyDown(event) {
    console.log("PLAYER", player.boundingBox)
    console.log("ROOM",room.boundingBox)
     console.log(window.innerWidth - 20, window.innerHeight - 20)
  //console.log(distance)
  if(event.keyCode == 38) { // up
    console.log("UP", room.boundingBox.max.y, player.position.y + speed)
    if(room.boundingBox.max.y < player.position.y + speed)
      player.position.y = room.boundingBox.max.y - 12
    else 
      player.position.y += speed;
    moveBox("up")
  }
  if (event.keyCode == 40){ // down
    if(room.boundingBox.min.y > player.position.y - speed)
      player.position.y = room.boundingBox.min.y + 12
    else
      player.position.y -= speed;
    moveBox("down")
  }
  if (event.keyCode == 37){  // left
    if(room.boundingBox.min.x > player.position.x - speed)
      player.position.x = room.boundingBox.min.x + 12
    else
      player.position.x -= speed;
    moveBox("left")
  }
  if (event.keyCode == 39){ // right
    if(room.boundingBox.max.x < player.position.x + speed)
      player.position.x = room.boundingBox.max.x - 12
    else
      player.position.x += speed;
    moveBox("right")
  }
  console.log("SPEED" + speed)
  console.log("POS X" + player.position.x)
  console.log("POS Y" + player.position.y)
}
// -- FUNCTION FOR PLAYER END -- //

// -- FUNCTION FOR BOX MOVEMENT AND COLLISION -- //
function moveBox(direction){
    // Move the box
    const boxSpeed = boxSize;
    // Check for collisions between the player and the box
    // handling simple collision
    // NEED BETTER COLLISION
    for(var i = 0; i < boxes.length; i++){
    if (player.boundingBox.intersectsBox(boxes[i].boundingBox)) {
        console.log(direction)
        if(direction === "down")
        boxes[i].position.y -= boxes[i];
        if(direction === "up")
        boxes[i].position.y += boxSpeed;
        if(direction === "left")
        boxes[i].position.x -= boxSpeed;
        if(direction === "right")
        boxes[i].position.x += boxSpeed;
    }
  }
}
// -- FUNCTION FOR BOX MOVEMENT AND COLLISION END -- //

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    window.addEventListener('keydown', onKeyDown, true);
    // continuously update bounding boxes for movement
    player.boundingBox.copy(player.geometry.boundingBox).applyMatrix4(player.matrixWorld);
    for(var i = 0; i < boxes.length; i++)
      boxes[i].boundingBox.copy(boxes[i].geometry.boundingBox).applyMatrix4(boxes[i].matrixWorld);
    room.boundingBox.copy(room.geometry.boundingBox).applyMatrix4(room.matrixWorld);
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
