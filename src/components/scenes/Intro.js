import * as Dat from 'dat.gui';
import {
    Scene,
    Color,
    MeshPhongMaterial,
    FontLoader,
    TextGeometry,
    PerspectiveCamera,
    OrthographicCamera,
} from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh, Audio, AudioListener, AudioLoader } from 'three';
import { Grub} from 'objects';
import { BasicLights } from 'lights';
import { PixelFont } from '../objects/Fonts';
import { Scenes } from '.';

class Intro extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x252b39);
        this.dialogueHappened = false;

        // -------- ADDING MESHES --------- //
        const lights = new BasicLights();
        const grub = new Grub(this);
        grub.position.set(0,0,0);

        // camera
        this.camera = new PerspectiveCamera(

        );
        // // Set the initial position and orientation of the camera
        // this.camera.position.set(0.7, 0, 3); // angled to like legend of zelda
        // this.camera.zoom = 1;
        // // can use lookAt to follow player position too
        // this.camera.lookAt(0.7, 0, 3);

        this.camera.add(grub);
        grub.position.set(-1, -0.5,-1.5);

        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };

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

            if (event.keyCode == 32 && !this.dialogueHappened) {
                    this.dialogue(grub);
            }

            // Zoom out
            if (event.code === 'KeyZ' || event.key === 'z') {
                this.camera.zoom -= 1;
                this.windowResizeHandler();
            }
            // Zoom in
            if (event.code === 'KeyX' || event.key === 'x') {
                this.camera.zoom += 1;
                this.windowResizeHandler();
            }
        }
        // ----------------------- //
        // -------- ADDING OBJECTS TO SCENE --------- //
        //   console.log("OBJECT 2" , player_box.boundingBox)
        this.add(lights, grub);
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

    dialogue(grub){
        var grub_position = grub.position.clone();
        var count = 0;

        const loader = new FontLoader();
        this.textMesh;
        loader.load(PixelFont, function (font) {
            const textGeometry = new TextGeometry("you're finally awake", {
                font: font,
                size: 0.08,
                height: 0,
            });
            Scenes.scenes['Intro'].textMesh = new Mesh(textGeometry, new MeshPhongMaterial({color: 0xffffff}));
            Scenes.scenes['Intro'].textMesh.position.set(grub_position.x, grub_position.y, grub_position.z + 0.2);
            Scenes.scenes['Intro'].add(Scenes.scenes['Intro'].textMesh);       
        });

        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            console.log(count);
            if (count >= 6){
                console.log(Scenes.scenes['Intro'].textMesh)
                this.remove(Scenes.scenes['Intro'].textMesh);  
                window.addEventListener('keydown', this.onKeyDown, false);
                window.removeEventListener('keydown', this.dialogueContinue, false); 
                Scenes.switchScene('SeedScene');
            }
            else if (count === 0){
                Scenes.scenes['Intro'].remove(Scenes.scenes['Intro'].textMesh);  
                console.log(Scenes.scenes['Intro']);
                loader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry( "You are probably wondering why you are here",
                            {
                                font: font,
                                size: 0.08,
                                height: 0
                            }
                        );
                        Scenes.scenes['Intro'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['Intro'].textMesh.position.set(grub_position.x, grub_position.y, grub_position.z + 0.2);
                        Scenes.scenes['Intro'].add(Scenes.scenes['Intro'].textMesh);
                    }
                );  
            }
            else if (count === 1){
                Scenes.scenes['Intro'].remove(Scenes.scenes['Intro'].textMesh);  
                loader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry( "As you know, Princeton represents the height of intellectualism.",
                            {
                                font: font,
                                size: 0.08,
                                height: 0
                            }
                        );
                        Scenes.scenes['Intro'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['Intro'].textMesh.position.set(grub_position.x, grub_position.y, grub_position.z + 0.2);
                        Scenes.scenes['Intro'].add(Scenes.scenes['Intro'].textMesh);
                    }
                );  
            }
            else if (count === 2){
                Scenes.scenes['Intro'].remove(Scenes.scenes['Intro'].textMesh);  
                loader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry( "We have no place for those falling into academic mediocracy...",
                            {
                                font: font,
                                size: 0.08,
                                height: 0
                            }
                        );
                        Scenes.scenes['Intro'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['Intro'].textMesh.position.set(grub_position.x, grub_position.y, grub_position.z + 0.2);
                        Scenes.scenes['Intro'].add(Scenes.scenes['Intro'].textMesh);
                    }
                );  
            }
            else if (count === 3){
                Scenes.scenes['Intro'].remove(Scenes.scenes['Intro'].textMesh);  
                loader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry( "Since you got a low low score of 95 on your last COS 426 assignment,",
                            {
                                font: font,
                                size: 0.08,
                                height: 0
                            }
                        );
                        Scenes.scenes['Intro'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['Intro'].textMesh.position.set(grub_position.x, grub_position.y, grub_position.z + 0.2);
                        Scenes.scenes['Intro'].add(Scenes.scenes['Intro'].textMesh);
                    }
                );  
            }
            else if (count === 4){
                Scenes.scenes['Intro'].remove(Scenes.scenes['Intro'].textMesh);  
                loader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry( "you must now prove that you are still worthy of being a student here.",
                            {
                                font: font,
                                size: 0.08,
                                height: 0
                            }
                        );
                        Scenes.scenes['Intro'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['Intro'].textMesh.position.set(grub_position.x, grub_position.y, grub_position.z + 0.2);
                        Scenes.scenes['Intro'].add(Scenes.scenes['Intro'].textMesh);
                    }
                );  
            }
            else if (count === 5){
                Scenes.scenes['Intro'].remove(Scenes.scenes['Intro'].textMesh);  
                loader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry( "Talk to me again when you are ready to answer my riddles...",
                            {
                                font: font,
                                size: 0.08,
                                height: 0
                            }
                        );
                        Scenes.scenes['Intro'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['Intro'].textMesh.position.set(grub_position.x, grub_position.y, grub_position.z + 0.2);
                        Scenes.scenes['Intro'].add(Scenes.scenes['Intro'].textMesh);
                    }
                );  
            }
            count++;
        }
        Scenes.scenes['Intro'].remove(Scenes.scenes['Intro'].textMesh);  
        window.removeEventListener('keydown', this.onKeyDown, false);
        window.addEventListener('keydown', this.dialogueContinue, false);
        this.dialogueHappened = true;
    }
}

export default Intro;
