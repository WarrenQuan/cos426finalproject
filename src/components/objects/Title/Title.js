import { Group, PlaneGeometry, TextureLoader,RepeatWrapping,sRGBEncoding,MeshBasicMaterial,DoubleSide,Mesh} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './land.gltf';

class Title extends Group {
    constructor(x, y, z) {
        super()
        this.name = 'land'
        const roomGeometry = new PlaneGeometry(
            20,
            14
        );
        const groundTexture = new TextureLoader().load(
            'src/components/objects/Title/title.png'
        );

        
        // ground texture
        groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
        groundTexture.repeat.set(1, 1);
        groundTexture.anisotropy = 16;
        groundTexture.encoding = sRGBEncoding;
        var roomMaterial = new MeshBasicMaterial({
            map: groundTexture,
            side: DoubleSide,
        });
        
        this.room = new Mesh(roomGeometry, roomMaterial);
        this.room.position.set(x, y, z);
        this.add(this.room);
        this.room.geometry.computeBoundingBox();
        this.room.boundingBox = this.room.geometry.boundingBox.clone();
    }

    getBoundingBox() {
        console.log(this.room.boundingBox)
        return this.room.boundingBox
    }
}

export default Title;
