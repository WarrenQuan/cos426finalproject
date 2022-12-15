import { Group, PlaneGeometry, TextureLoader,RepeatWrapping,sRGBEncoding,MeshBasicMaterial,DoubleSide,Mesh} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './land.gltf';

class Land extends Group {
    constructor() {
        super()
        this.name = 'land'
        const roomGeometry = new PlaneGeometry(
            14,
            14
        );
        const groundTexture = new TextureLoader().load(
            'src/components/objects/Land/con.jpeg'
        );

        
        // ground texture
        groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
        groundTexture.repeat.set(10, 10);
        groundTexture.anisotropy = 16;
        groundTexture.encoding = sRGBEncoding;
        var roomMaterial = new MeshBasicMaterial({
            map: groundTexture,
            side: DoubleSide,
        });
        
        this.room = new Mesh(roomGeometry, roomMaterial);
        this.room.position.set(0, 0, 0);
        this.add(this.room);
        this.room.geometry.computeBoundingBox();
        this.room.boundingBox = this.room.geometry.boundingBox.clone();
    }

    getBoundingBox() {
        console.log(this.room.boundingBox)
        return this.room.boundingBox
    }
}

export default Land;
