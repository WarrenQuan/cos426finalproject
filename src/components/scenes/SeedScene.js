import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
//import { Flower, Land, Player } from 'objects';
import { Land, Player, Grub } from 'objects';
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

        //this.add(land, flower, lights, player);
        this.add(land, lights, player, grub);

        //this.add( flower)
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

export default SeedScene;
