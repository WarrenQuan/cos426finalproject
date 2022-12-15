import { WebGLRenderer} from 'three';
import SeedScene from './SeedScene';
import SeedSceneTwo from './SeedSceneTwo';
import Intro from './Intro';
class Scenes {
    constructor(){
        this.scenes = {};
        this.currentScene = undefined;
        this.renderer = undefined;
    }

    create(){
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.scenes['Intro'] = new Intro();
        this.scenes['SeedScene'] = new SeedScene();
        this.scenes['SeedSceneTwo'] = new SeedSceneTwo();

        this.currentScene = this.scenes['SeedScene'];
        this.currentScene.addEvents();
        
    }

    switchScene(sceneKey) {
        this.currentScene.removeEvents();
        this.currentScene = this.scenes[sceneKey];
        this.currentScene.addEvents();
    }
}

const instance = new Scenes();

export default instance;