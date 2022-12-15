import { Group, TextGeometry, FontLoader, Font } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './untitled.gltf';

class Text extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // ---- TEXT --- //
        const loader = new FontLoader();

        loader.load('fonts/helvetiker_bold.typeface.json', function (font) {

            const textGeometry = new TextGeometry('Hello three.js!', {
                font: "helvetiker",
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5

            });
            var textMaterial = new MeshBasicMaterial({
                //--- transparent box code ---//
                // transparent: true,
                // opacity: 0,

                //--- wire box code ---//
                color: 0xff0000,
            });
            var mesh = new THREE.Mesh(textGeometry, textMaterial);
            mesh.position.set(0, 0, -1 / 32);
            this.add(mesh)
            console.log("ah: ", mesh)
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
