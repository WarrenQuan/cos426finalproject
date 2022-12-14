import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './untitled.gltf';

class Player extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

       // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: this.spin.bind(this),
            twirl: 0,
        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'player';
        loader.load(MODEL, (gltf) => {


            // --- PLAYER MOVEMENT --- //
            //const playerSize = ;
            const speed = .25;
            window.addEventListener('keydown', onKeyDown, true);
            
            function onKeyDown(event) {
                if (event.keyCode == 38) {
                   //console.log(gltf.scene.rotation)
                    // up
                    // if outside boundary of the room/plane, set to room bounding
                   // if (room.boundingBox.max.y < player.position.y + speed)
                        //player.position.y = room.boundingBox.max.y - 12;
                    //else player.position.y += speed;
                    gltf.scene.position.y += speed;
                    if (gltf.scene.rotation.x != 270 * Math.PI / 180.0) {
                        gltf.scene.rotation.x = 270 * Math.PI / 180.0;
                        if (gltf.scene.rotation.y != 0) {
                            gltf.scene.rotation.y = 0
                        }
                    }

                    // move box if collide
                    //moveBox('up');
                }
                if (event.keyCode == 40) {
                    // down
                    // if (room.boundingBox.min.y > player.position.y - speed)
                    //     player.position.y = room.boundingBox.min.y + 12;
                    gltf.scene.position.y -= speed;
                    if (gltf.scene.rotation.x != 90 * Math.PI / 180.0) {
                        gltf.scene.rotation.x = 90 * Math.PI / 180.0;
                        if (gltf.scene.rotation.y != 0) {
                            gltf.scene.rotation.y = 0
                        }
                    }
                    // moveBox('down');
                }
                if (event.keyCode == 37) {
                    // left
                    // if (room.boundingBox.min.x > player.position.x - speed)
                    //     player.position.x = room.boundingBox.min.x + 12;
                    gltf.scene.position.x -= speed;
                    // moveBox('left');
                    if (gltf.scene.rotation.y != 270 * Math.PI / 180.0) {
                        gltf.scene.rotation.y = 270 * Math.PI / 180.0;
                        if (gltf.scene.rotation.x != 0) {
                            gltf.scene.rotation.x = 0
                        }
                    }
                }
                if (event.keyCode == 39) {
                    // right
                    // if (room.boundingBox.max.x < player.position.x + speed)
                    //     player.position.x = room.boundingBox.max.x - 12;
                    gltf.scene.position.x += speed;
                    //moveBox('right');
                    if (gltf.scene.rotation.y != 90 * Math.PI / 180.0) {
                        gltf.scene.rotation.y = 90 * Math.PI / 180.0;
                        if (gltf.scene.rotation.x != 0) {
                            gltf.scene.rotation.x = 0
                        }
                    }
                }
            }
            // ----------------------- //

           // gltf.scene.position.x = 1
            this.add(gltf.scene);
        });

        // Add self to parent's update list
       parent.addToUpdateList(this);

        //Populate GUI
        this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'spin');
    }

    spin() {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Player;
