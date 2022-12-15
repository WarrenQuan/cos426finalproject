import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
//import { Flower, Land, Player } from 'objects';
import { Land, Player, Grub, Text} from 'objects';
import { BasicLights } from 'lights';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

        // -------- ADDING MESHES --------- // 
        const land = new Land();
        // const flower = new Flower(this);
        const lights = new BasicLights();
        const player = new Player(this);
        const grub = new Grub(this);
        const text = new Text();
        console.log("TEXT", text.position)

        var objects = []
        objects.push(grub)
        console.log(objects)
        // const grub_box = new GrubBox();
        // const player_box = new PlayerBox();

        // ---- PLAYER BOUNDING BOX ---//
        var playerGeometry = new BoxGeometry(1, 1, 1);
        var playerMaterial = new MeshBasicMaterial({
            //--- transparent box code ---//
            // transparent: true,
            // opacity: 0,

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
            //--- transparent box code ---//
            // transparent: true,
            // opacity: 0,

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

        var boxes = [];
        boxes.push(grub_box);

        // Load object
        //const loader = new GLTFLoader();

        //this.name = 'GrubBox';

        // -------- BOXES --------//
        // need to find some way to make multiple
        // Create multiple boxes for pushing
        for (var i = -3; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                const box = new Mesh(
                    new BoxGeometry(1, 1, 1),
                    new MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
                );
                box.geometry.computeBoundingBox();
                box.boundingBox = box.geometry.boundingBox.clone();
                box.position.set(2 * i, 2 * j, -1 / 32);
                // kinda buggy
                // box.position.set(Math.floor(Math.random() * window.innerHeight) - (window.innerHeight / 2), Math.floor(Math.random() * window.innerWidth) - (window.innerWidth / 2), 0);
                this.add(box);
                this.addToUpdateList(box);
                boxes.push(box);
            }
        }
        // -------- BOXES END --------//

        // --- PLAYER MOVEMENT --- //
        //const playerSize = ;
        const speed = 1;
        window.addEventListener('keydown', onKeyDown, true);
        function onKeyDown(event) {
            console.log(player_box.position)
            if (event.keyCode == 32 && player_box.boundingBox.intersectsBox(grub_box.boundingBox)) {
                // interact with element
                console.log('hello')
            }
            if (event.keyCode == 38) {
                // forward
                player.position.y += speed;
                player_box.position.y += speed;
                if (player.rotation.z != 0) {
                    player.rotation.z = 0
                }
                if (player.rotation.y != 180 * Math.PI / 180.0) {
                    player.rotation.y = 180 * Math.PI / 180.0
                }
                // move box if collide
                collision(player_box, 'up', boxes, objects);
            }
            if (event.keyCode == 40) {
                // down
                // if (rub_box.boundingBox.min.y > player.position.y - speed)
                //     player.position.y = room.boundingBox.min.y + 12;
                player.position.y -= speed;
                player_box.position.y -= speed;
                if (player.rotation.y != 0 * Math.PI / 180.0) {
                    player.rotation.y = 0 * Math.PI / 180.0
                }
                collision(player_box, 'down', boxes, objects);
            }
            if (event.keyCode == 37) {
                // left
                // if (room.boundingBox.min.x > player.position.x - speed)
                //     player.position.x = room.boundingBox.min.x + 12;
                player.position.x -= speed;
                player_box.position.x -= speed;
                collision(player_box, 'left', boxes, objects);
                if (player.rotation.y != 270 * Math.PI / 180.0) {
                    player.rotation.y = 270 * Math.PI / 180.0;
                }
            }
            if (event.keyCode == 39) {
                // right
                // if (room.boundingBox.max.x < player.position.x + speed)
                //     player.position.x = room.boundingBox.max.x - 12;
                player.position.x += speed;
                player_box.position.x += speed;
                collision(player_box, 'right', boxes, objects);
                if (player.rotation.y != 90 * Math.PI / 180.0) {
                    player.rotation.y = 90 * Math.PI / 180.0;
                }
            }
        }
        // ----------------------- //
        // -------- ADDING OBJECTS TO SCENE --------- //
        //   console.log("OBJECT 2" , player_box.boundingBox)
        this.add(land, lights, player, grub, player_box, grub_box, text);

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

            // player_box.boundingBox
            // .copy(player_box.geometry.boundingBox)
            // .applyMatrix4(player_box.matrixWorld);
            // grub_box.boundingBox
            // .copy(grub_box.geometry.boundingBox)
            // .applyMatrix4(grub_box.matrixWorld);
            // Call update for each object in the updateList

            // for (var i = 0; i < boxes.length; i++)
            //     boxes[i].boundingBox
            //         .copy(boxes[i].geometry.boundingBox)
            //         .applyMatrix4(boxes[i].matrixWorld);
            // room.boundingBox
            //     .copy(room.geometry.boundingBox)
            //     .applyMatrix4(room.matrixWorld);
            // }
        }

    }
}
function collision(object, direction, boxes, objects) {
    var boxSpeed = 1;
    for (let i = 0; i < boxes.length; i++) {
        if (object.boundingBox.intersectsBox(boxes[i].boundingBox)) {
            if (direction === 'down' && boxes[i].position.y <= object.position.y) {console.log("DOWN 1")
                if (boxes[i].position.x >= object.position.x && boxes[i].position.x <= object.position.x) {
                    // if outside boundary of the room/plane, set to room bounding
                    // if (room.boundingBox.min.y > boxes[i].position.y - boxSpeed)
                    //     boxes[i].position.y = room.boundingBox.min.y + 20;

                    // for (let j = 0; j < boxes.length; j++) {
                    //     if (object.boundingBox.intersectsBox(boxes[j].boundingBox) && boxes[j].position.y <= boxes[i].position.y) {
                    //             if (boxes[j].position.x >= boxes[i].position.x && boxes[j].position.x <= boxes[i].position.x) {
                    //             boxes[j].position.y -= boxSpeed;

                    //            }
                    //         }
                    //     }
                    
                    boxes[i].position.y -= boxSpeed;
                    objects[i].position.y -= boxSpeed;
                    console.log("DOWN 2")
                }
                // if player still coliding after pushed (potentially not use direction but see which side its closest) (buggy)
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.y = boxes[i].boundingBox.max.y + 5;
            }
            if (direction === 'up' && boxes[i].position.y >= object.position.y) {
                if (boxes[i].position.x >= object.position.x && boxes[i].position.x <= object.position.x) {
                    // if (room.boundingBox.max.y < boxes[i].position.y + boxSpeed)
                    //     boxes[i].position.y = room.boundingBox.max.y - 20;
                    boxes[i].position.y += boxSpeed;
                    objects[i].position.y += boxSpeed;
                }
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.y = boxes[i].boundingBox.min.y;
            }
            if (direction === 'left' && boxes[i].position.x <= object.position.x) {
                if (boxes[i].position.y >= object.position.y && boxes[i].position.y <= object.position.y) {
                    // if (room.boundingBox.min.x > boxes[i].position.x - boxSpeed)
                    //     boxes[i].position.x = room.boundingBox.min.x + 20;
                    boxes[i].position.x -= boxSpeed;
                    objects[i].position.x -= boxSpeed;
                }
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.x = boxes[i].boundingBox.max.x + 5;
            }
            if (direction === 'right' && boxes[i].position.x >= object.position.x) {
                if (boxes[i].position.y >= object.position.y && boxes[i].position.y <= object.position.y) {

                    // if (room.boundingBox.max.x < boxes[i].position.x + boxSpeed)

                    // boxes[i].position.x = room.boundingBox.max.x - 20;
                    boxes[i].position.x += boxSpeed;
                    objects[i].position.x += boxSpeed;
                }
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.x = boxes[i].boundingBox.min.x - 5;
            }
            // boxes[i].geometry.computeBoundingBox();
            // boxes[i].boundingBox = boxes[i].geometry.boundingBox.clone();
            // object.geometry.computeBoundingBox();
            // object.boundingBox = object.geometry.boundingBox.clone();
        }
        //if (this.boundingBox.min.y >)

    }

}


export default SeedScene;
