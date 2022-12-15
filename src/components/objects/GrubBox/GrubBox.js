import { Group, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './untitled.gltf';

class GrubBox extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // ---- BOUNDING BOX ---//
            var playerGeometry = new BoxGeometry(1, 1, 1);
            var playerMaterial = new MeshBasicMaterial({
                //--- transparent box code ---//
                // transparent: true,
                // opacity: 0,

                 //--- wire box code ---//
                color: 0xff0000,
                wireframe: true,
            });
            var box = new Mesh(playerGeometry, playerMaterial);
            box.geometry.computeBoundingBox();
            box.boundingBox = box.geometry.boundingBox.clone();
            box.position.set(1, .5, -1/32);
            //---------------------//

        // Load object
        const loader = new GLTFLoader();

        this.name = 'GrubBox';
       
        this.add(box);
         
        // Add self to parent's update list
       //parent.addToUpdateList(this);

        //Populate GUI
       // this.state.gui.add(this.state, 'bob');
        //this.state.gui.add(this.state, 'spin');
    }

    

}

export default GrubBox;
