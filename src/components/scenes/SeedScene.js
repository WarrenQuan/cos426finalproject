import * as Dat from 'dat.gui';
import {
    Scene,
    Color,
    MeshPhongMaterial,
    FontLoader,
    TextGeometry,
    TextureLoader,
    OrthographicCamera,
} from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh, Audio, AudioListener, AudioLoader } from 'three';
//import { Flower, Land, Player } from 'objects';
import { Land, Player, Grub, Text } from 'objects';
import { BasicLights } from 'lights';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PixelFont } from '../objects/Fonts';
import { Scenes } from '.';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        this.dialogueHappened = false;

        // -------- ADDING MESHES --------- //
        const land = new Land();
        // const flower = new Flower(this);
        const lights = new BasicLights();
        const player = new Player(this);
        const grub = new Grub(this);

        // camera
        this.camera = new OrthographicCamera(
            window.innerWidth / -140,
            window.innerWidth / 140,
            window.innerHeight / 140,
            window.innerHeight / -140,
            0,
            1000
        );
        // Set the initial position and orientation of the camera
        this.camera.position.set(0, 5, 14); // angled to like legend of zelda
        // can use lookAt to follow player position too
        this.camera.lookAt(0, 0, 0);

        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };

        // ---- PLAYER BOUNDING BOX ---//
        var playerGeometry = new BoxGeometry(1, 1, 1);
        var playerMaterial = new MeshBasicMaterial({

            //--- wire box code ---//
            color: 0xff0000,
            wireframe: true,
        });

        var player_box = new Mesh(playerGeometry, playerMaterial);
        player_box.geometry.computeBoundingBox();
        player_box.boundingBox = player_box.geometry.boundingBox.clone();
        player_box.position.set(0, 0, -1 / 32);
        this.addToUpdateList(player_box);

        //----------PLAYER BOUNDING BOX END-----------//

        // ---- GRUB BOUNDING BOX ---//
        var playerGeometry = new BoxGeometry(1, 1, 1);
        var playerMaterial = new MeshBasicMaterial({


            //--- wire box code ---//
            color: 0xff0000,
            wireframe: true,
        });
        var grub_box = new Mesh(playerGeometry, playerMaterial);
        grub_box.geometry.computeBoundingBox();
        grub_box.boundingBox = grub_box.geometry.boundingBox.clone();
        grub_box.position.set(1, 0, -1 / 32);
        this.addToUpdateList(grub_box);
        //----------GRUB BOUNDING BOX END -----------//
        var block = []
        var boxes = [];
        block.push(grub_box)
        // boxes.push(grub_box);

        // Load object
        //const loader = new GLTFLoader();

        //this.name = 'GrubBox';

        // -------- BOXES --------//
        // need to find some way to make multiple
        // Create multiple boxes for pushing
        const groundTexture = new TextureLoader().load(
            'src/components/objects/Land/con.jpeg'
        );
        for (var i = -3; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                const box = new Mesh(
                    new BoxGeometry(1, 1, 1),
                    // new MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
                    new MeshBasicMaterial({ map: groundTexture })
                );
                box.geometry.computeBoundingBox();
                box.boundingBox = box.geometry.boundingBox.clone();
                box.position.set(2 * i, 2 * j, -1 / 32);
                               this.add(box);
                this.addToUpdateList(box);
                boxes.push(box);
                block.push(box)

            }
        }
        // -------- BOXES END --------//

        // -------- SOUND CODE PT 1 START ---------- //
        // create an AudioListener and add it to the camera
        const listener = new AudioListener();
        this.camera.add(listener);

        // create a global audio source
        const sound = new Audio(listener);
        // -------- SOUND CODE PT 1 END ---------- //

        // --- PLAYER MOVEMENT --- //
        //const playerSize = ;
        const speed = 1;
        this.onKeyDown = (event) => {
// ----- SOUND PT 2 ----- //
    // load a sound and set it as the Audio object's buffer
    // chrome requires user input to start audio so need to be on a key pressed or smth
    const audioLoader = new AudioLoader();
    // replace music
    audioLoader.load(
        'src/sounds/dungeon.mp3',
        function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.1);
            if (!sound.isPlaying) sound.play();
        }
    );
    // ----- SOUND PT 2 ----- //

            let old_player_pos = player.position.clone();
            let old_player_box_pos = player_box.position.clone();
            let notBlocked = true
            if (event.keyCode == 38) {
                // if (grub_box.boundingBox.max.y < player.position.y + speed && player_box.boundingBox.intersectsBox(grub_box.boundingBox))
                //         player.position.y -= speed;
                // up
                for(var i = 0; i < block.length; i++){
                    if (
                        (
                            player.position.y < block[i].boundingBox.max.y &&
                            block[i].boundingBox.max.y <
                                player.position.y + speed * 2 &&
                            player_box.boundingBox.intersectsBox(
                                block[i].boundingBox
                            ) &&
                            player.position.x < block[i].boundingBox.max.x &&
                            player.position.x > block[i].boundingBox.min.x
                        )
                    )  notBlocked = false
                }
                if (notBlocked) {
                    // if intersect, in middle,  will be above after, and not already above
                    player.position.y += speed;
                    player_box.position.y += speed;
                }
                if (player.rotation.z != 0) {
                    player.rotation.z = 0;
                }
                if (player.rotation.y != (180 * Math.PI) / 180.0) {
                    player.rotation.y = (180 * Math.PI) / 180.0;
                }
                // move box if collide
                collision(player_box, 'up', boxes);
            }
            if (event.keyCode == 40) {
                // down
                // if (grub_box.boundingBox.min.y > player.position.y - speed && player_box.boundingBox.intersectsBox(grub_box.boundingBox))
                //     player.position.y += speed;
                for(var i = 0; i < block.length; i++){
                    if (
                        (
                            player.position.y > block[i].boundingBox.min.y &&
                            block[i].boundingBox.min.y >
                                player.position.y - speed * 2 &&
                            player_box.boundingBox.intersectsBox(
                                block[i].boundingBox
                            ) &&
                            player.position.x < block[i].boundingBox.max.x &&
                            player.position.x > block[i].boundingBox.min.x
                        )
                    )  notBlocked = false
                }
                if (notBlocked) {
                    player.position.y -= speed;
                    player_box.position.y -= speed;
                }
                if (player.rotation.y != (0 * Math.PI) / 180.0) {
                    player.rotation.y = (0 * Math.PI) / 180.0;
                }
                collision(player_box, 'down', boxes);
            }
            if (event.keyCode == 37) {
                // left
                // if (grub_box.boundingBox.min.x > player.position.x - speed && player_box.boundingBox.intersectsBox(grub_box.boundingBox))
                //     player.position.x += speed;
                for(var i = 0; i < block.length; i++){
                    if (
                        (
                            player.position.x > block[i].boundingBox.min.x &&
                            block[i].boundingBox.min.x >
                                player.position.x - speed * 2 &&
                            player_box.boundingBox.intersectsBox(
                                block[i].boundingBox
                            ) &&
                            player.position.y < block[i].boundingBox.max.y &&
                            player.position.y > block[i].boundingBox.min.y
                        )
                    )  notBlocked = false
                }
                if (notBlocked) {
                    player.position.x -= speed;
                    player_box.position.x -= speed;
                }
                if (player.rotation.y != (270 * Math.PI) / 180.0) {
                    player.rotation.y = (270 * Math.PI) / 180.0;
                }
                collision(player_box, 'left', boxes);
            }
            if (event.keyCode == 39) {
                // right
                console.log('PLAYER', player.position.y);
                console.log('GRUB', grub_box.boundingBox.max.y);
                for(var i = 0; i < block.length; i++){
                    if (
                        player.position.x < block[i].boundingBox.max.x &&
                        block[i].boundingBox.max.x <
                            player.position.x + speed * 2 &&
                        player_box.boundingBox.intersectsBox(
                            block[i].boundingBox
                        ) &&
                        player.position.y < block[i].boundingBox.max.y &&
                        player.position.y > block[i].boundingBox.min.y
                    )
                      notBlocked = false
                }
                if (notBlocked) {
                    player.position.x += speed;
                    player_box.position.x += speed;
                }

                if (player.rotation.y != (90 * Math.PI) / 180.0) {
                    player.rotation.y = (90 * Math.PI) / 180.0;
                }
                collision(player_box, 'right', boxes);
            }

            if (event.keyCode == 32 && !this.dialogueHappened) {
                if (player_box.boundingBox.intersectsBox(grub_box.boundingBox)){
                    this.dialogue(player_box, grub_box);
                }
            }

            // Zoom out
            if (event.code === 'KeyZ' || event.key === 'z') {
                this.camera.zoom -= 0.05;
                this.windowResizeHandler();
            }
            // Zoom in
            if (event.code === 'KeyX' || event.key === 'x') {
                this.camera.zoom += 0.1;
                this.windowResizeHandler();
            }
        }
        // ----------------------- //
        // -------- ADDING OBJECTS TO SCENE --------- //
        //   console.log("OBJECT 2" , player_box.boundingBox)
        this.add(land, lights, player, grub, player_box, grub_box);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        for (const obj of updateList) {
            // console.log(obj)
            // console.log(obj.boundingBox)
            // if it has a bounding box
            if (obj.boundingBox !== undefined) {
                obj.boundingBox
                    .copy(obj.geometry.boundingBox)
                    .applyMatrix4(obj.matrixWorld);
            }

        }
    }

    addEvents() {
        // Resize Handler
        this.windowResizeHandler();
        window.addEventListener('resize', this.windowResizeHandler, false);
        window.addEventListener('keydown', this.onKeyDown, true);
    }

    removeEvents() {
        window.removeEventListener('resize', this.windowResizeHandler, false);
        window.removeEventListener('keydown', this.onKeyDown, false);
    }

    dialogue(player, grub){
        var player_pos = player.position.clone();
        // console.log(this.camera.position)
        // this.camera.position.x = player_pos.x;
        // this.camera.position.y = player_pos.y;
        // this.camera.position.z = grub.position.z;
        // console.log(this.camera.position)

        // Add cube to back
        const boxGeometry = new BoxGeometry(window.innerWidth / -90, window.innerHeight / -1000, 1);
        // const boxMaterial = new MeshBasicMaterial({color: 0x9b673c});
        
        const boxMaterial = new MeshBasicMaterial({color: 0xffffff});
        var cube = new Mesh(boxGeometry, boxMaterial);
        cube.position.set(window.innerWidth / -700, window.innerHeight / -150, player_pos.z);
        console.log(cube.position)
        this.add(cube);

        const loader = new FontLoader();
        this.textMesh;
        loader.load(PixelFont, function (font) {
            const textGeometry = new TextGeometry('text', {
                font: font,
                size: 0.5,
                height: 0,
            });
            Scenes.scenes['SeedScene'].textMesh = new Mesh(textGeometry, new MeshPhongMaterial({color: 0xffffff}));
            Scenes.scenes['SeedScene'].textMesh.position.set(window.innerWidth / -140, window.innerHeight / -140, player_pos.z);
            Scenes.scenes['SeedScene'].add(Scenes.scenes['SeedScene'].textMesh);
        });
        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            // Scenes.scenes['SeedScene'].remove(Scenes.scenes['SeedScene'].textMesh);
        }
        window.removeEventListener('keydown', this.onKeyDown, false);
        window.addEventListener('keydown', this.dialogueContinue, false);
        this.dialogueHappened = true;
    }
}
function hasIntersection(object, boxes) {
    for (let i = 0; i < boxes.length; i++) {
        if (
            object.boundingBox.intersectsBox(boxes[i].boundingBox) &&
            boxes[i] != object
        ) {
            return true;
        }
    }
    return false;
}

function collision(object, direction, boxes) {
    var boxSpeed = 1;
    var savedBox;
    var chainedBoxes = []
    for (let i = 0; i < boxes.length; i++) {
        if (object.boundingBox.intersectsBox(boxes[i].boundingBox)) {
            if (
                direction === 'down' &&
                boxes[i].position.y <= object.position.y
            ) {
                console.log('DOWN 1');
                if (
                    boxes[i].position.x >= object.position.x &&
                    boxes[i].position.x <= object.position.x
                ) {
                    //objectFound = true;
                    // if outside boundary of the room/plane, set to room bounding
                    // if (room.boundingBox.min.y > boxes[i].position.y - boxSpeed)
                    //     boxes[i].position.y = room.boundingBox.min.y + 20;

                    boxes[i].position.y -= boxSpeed;
                    savedBox = boxes[i];
                    // for (let j = 0; j < boxes.length; j++) {
                    //     if (object.boundingBox.intersectsBox(boxes[j].boundingBox) && boxes[j].position.y <= boxes[i].position.y) {
                    //             if (boxes[j].position.x >= boxes[i].position.x && boxes[j].position.x <= boxes[i].position.x) {
                    //             boxes[j].position.y -= boxSpeed;

                    //            }
                    //         }
                    //     }
                }

            }
            if (
                direction === 'up' &&
                boxes[i].position.y >= object.position.y
            ) {
                if (
                    boxes[i].position.x >= object.position.x &&
                    boxes[i].position.x <= object.position.x
                ) {
                    // if (room.boundingBox.max.y < boxes[i].position.y + boxSpeed)
                    //     boxes[i].position.y = room.boundingBox.max.y - 20;
                    // while (hasIntersection(boxes[i], boxes)) {
                    //     //console.log('hello')
                    // collision(boxes[i], direction, boxes)
                    // }
                    boxes[i].position.y += boxSpeed;
                    savedBox = boxes[i];
                }

            }
            if (
                direction === 'left' &&
                boxes[i].position.x <= object.position.x
            ) {
                if (
                    boxes[i].position.y >= object.position.y &&
                    boxes[i].position.y <= object.position.y
                ) {
                    // if (room.boundingBox.min.x > boxes[i].position.x - boxSpeed)
                    //     boxes[i].position.x = room.boundingBox.min.x + 20;
                    boxes[i].position.x -= boxSpeed;
                    savedBox = boxes[i];
                }
   
            }
            if (
                direction === 'right' &&
                boxes[i].position.x >= object.position.x 
            ) {
                if (
                    boxes[i].position.y >= object.position.y &&
                    boxes[i].position.y <= object.position.y
                ) {
                    // if (room.boundingBox.max.x < boxes[i].position.x + boxSpeed)

                    // boxes[i].position.x = room.boundingBox.max.x - 20;
                    boxes[i].position.x += boxSpeed;
                    savedBox = boxes[i];
                }

            }
        }
    }

    for (var i = 0; i < boxes.length; i++) {
        if (savedBox.boundingBox.intersectsBox(boxes[i].boundingBox) &&
            savedBox !== boxes[i]
        ) {
            console.log('INSIDE');
            console.log(boxes[i].boundingBox);
            if (direction === 'down' &&  (
                savedBox.position.y < boxes[i].boundingBox.max.y &&
                boxes[i].boundingBox.max.y <
                savedBox.position.y + boxSpeed * 2 &&
                savedBox.boundingBox.intersectsBox(
                    boxes[i].boundingBox
                ) &&
                savedBox.position.x < boxes[i].boundingBox.max.x &&
                savedBox.position.x > boxes[i].boundingBox.min.x
            )) {
                savedBox.position.y += boxSpeed;
            } // if direction is down and going down would make it
            if (direction === 'up' && (
                savedBox.position.y < boxes[i].boundingBox.max.y &&
                boxes[i].boundingBox.max.y <
                savedBox.position.y + boxSpeed * 2 &&
                    savedBox.boundingBox.intersectsBox(
                    boxes[i].boundingBox
                ) &&
                savedBox.position.x < boxes[i].boundingBox.max.x &&
                savedBox.position.x > boxes[i].boundingBox.min.x
            )) {
                savedBox.position.y -= boxSpeed;
            }
            if (direction === 'left' && (
                savedBox.position.x > boxes[i].boundingBox.min.x &&
                boxes[i].boundingBox.min.x >
                savedBox.position.x - boxSpeed * 2 &&
                savedBox.boundingBox.intersectsBox(
                    boxes[i].boundingBox
                ) &&
                savedBox.position.y < boxes[i].boundingBox.max.y &&
                savedBox.position.y > boxes[i].boundingBox.min.y
            )) {
                savedBox.position.x += boxSpeed;
            }
            if (direction === 'right' && (
                savedBox.position.x < boxes[i].boundingBox.max.x &&
                boxes[i].boundingBox.max.x <
                savedBox.position.x + boxSpeed * 2 &&
                savedBox.boundingBox.intersectsBox(
                    boxes[i].boundingBox
                ) &&
                savedBox.position.y < boxes[i].boundingBox.max.y &&
                savedBox.position.y > boxes[i].boundingBox.min.y
            )) {
                savedBox.position.x -= boxSpeed;
            }
        }
    }
}

export default SeedScene;
