
import { Group, Font, MeshPhongMaterial, Mesh} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './untitled.gltf';
import HelvetikerFontPath from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { PixelFont } from '../Fonts'

class Text extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // ---- TEXT --- //
        const loader = new FontLoader();

        loader.load(PixelFont, function (font) {

            const textGeometry = new TextGeometry('Hello Hoe!', {
                font: font,
                size: 0.5,
                height: 0,
            });
            
            const mesh = new Mesh(textGeometry, new MeshPhongMaterial({color: 0xffffff}));
            console.log(mesh.position)
            mesh.position.set(0, 0, 2);
        });

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

export default Text;
