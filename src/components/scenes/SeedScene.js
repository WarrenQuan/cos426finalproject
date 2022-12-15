import * as Dat from 'dat.gui';
import { Scene, Color} from 'three';
//import { Flower, Land, Player } from 'objects';
import { Land, Player, Grub, PlayerBox, GrubBox } from 'objects';
import { BasicLights } from 'lights';

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

        // Add meshes to scene
        const land = new Land();
       // const flower = new Flower(this);
        const lights = new BasicLights();
        const player = new Player(this);
        const grub = new Grub(this);
        const player_box = new PlayerBox();
        const grub_box = new GrubBox();
        var boxs = [];
        boxs.push(grub_box);



        // --- PLAYER MOVEMENT --- //
            //const playerSize = ;
            const speed = .5;
            window.addEventListener('keydown', onKeyDown, true);
            function onKeyDown(event) {
             
                if (event.keyCode == 38) {
                    // forward
                    player.position.y += speed;
                    player_box.position.y +=speed;
                    if (player.rotation.z != 0) {
                        player.rotation.z = 0
                    }
                    if (player.rotation.y != 180 * Math.PI / 180.0) {
                        player.rotation.y = 180 * Math.PI / 180.0
                    }
                    // move box if collide
                    collision(player_box, 'up', boxs);
                }
                if (event.keyCode == 40) {
                    // down
                    if (rub_box.boundingBox.min.y > player.position.y - speed)
                        player.position.y = room.boundingBox.min.y + 12;
                    player.position.y -= speed;
                    player_box.position.y -= speed;
                    if (player.rotation.y != 0 * Math.PI / 180.0) {
                        player.rotation.y = 0 * Math.PI / 180.0
                    }
                    collision(player_box,'down', boxs);
                }
                if (event.keyCode == 37) {
                    // left
                    // if (room.boundingBox.min.x > player.position.x - speed)
                    //     player.position.x = room.boundingBox.min.x + 12;
                    player.position.x -= speed;
                    player_box.position.x -= speed;
                    collision(player_box,'left', boxs);
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
                    collision(player_box,'right', boxs);
                    if (player.rotation.y != 90 * Math.PI / 180.0) {
                        player.rotation.y = 90 * Math.PI / 180.0;
                    }
                }
            }
 // ----------------------- //





        // -------- ADDING OBJECTS TO SCENE --------- //
        this.add(land, lights, player, grub, player_box, grub_box);

    }



    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}
function collision(object, direction, boxs) {
    var boxSpeed = .5;
    for (let i = 0; i < boxs.length; i++) {
        if (object.boundingBox.intersectsBox(boxs[i].boundingBox)) {
            
            if (direction === 'down') {
                // if outside boundary of the room/plane, set to room bounding
                if (room.boundingBox.min.y > boxs[i].position.y - boxSpeed)
                    boxs[i].position.y = room.boundingBox.min.y + 20;
                else boxs[i].position.y -= boxSpeed;
                // if player still coliding after pushed (potentially not use direction but see which side its closest) (buggy)
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.y = boxes[i].boundingBox.max.y + 5;
            }
            if (direction === 'up') {
                if (room.boundingBox.max.y < boxs[i].position.y + boxSpeed)
                    boxs[i].position.y = room.boundingBox.max.y - 20;
                else boxs[i].position.y += boxSpeed;
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.y = boxes[i].boundingBox.min.y;
            }
            if (direction === 'left') {
                if (room.boundingBox.min.x > boxes[i].position.x - boxSpeed)
                    boxs[i].position.x = room.boundingBox.min.x + 20;
                else boxs[i].position.x -= boxSpeed;
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.x = boxes[i].boundingBox.max.x + 5;
            }
            if (direction === 'right') {
                if (room.boundingBox.max.x < boxs[i].position.x + boxSpeed)
                boxs[i].position.x = room.boundingBox.max.x - 20;
                else boxs[i].position.x += boxSpeed;
                // if (player.boundingBox.intersectsBox(boxes[i].boundingBox))
                //     player.position.x = boxes[i].boundingBox.min.x - 5;
            }
        }
        //if (this.boundingBox.min.y >)
        
    }

}

export default SeedScene;
