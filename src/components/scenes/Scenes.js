import { WebGLRenderer, PerspectiveCamera, Vector3, OrthographicCamera, TextGeometry, FontLoader } from 'three';
import { SeedScene } from 'scenes';
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

        this.currentScene = this.scenes['title'];
        this.currentScene.addEvents();
    }
}

const instance = new Scenes();

export default instance;