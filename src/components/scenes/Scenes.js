import { WebGLRenderer} from 'three';
import SeedScene from './SeedScene';
class Scenes {
    constructor(){
        this.scenes = {};
        this.currentScene = undefined;
        this.renderer = undefined;
    }

    create(){
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.scenes['SeedScene'] = new SeedScene();

        this.currentScene = this.scenes['SeedScene'];
        this.currentScene.addEvents();
    }
}

const instance = new Scenes();

export default instance;