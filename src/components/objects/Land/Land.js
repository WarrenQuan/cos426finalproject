import { Group, PlaneGeometry, TextureLoader,RepeatWrapping,sRGBEncoding,MeshBasicMaterial,DoubleSide,Mesh} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './land.gltf';

class Land extends Group {
    constructor() {
        super()
        this.name = 'land'
        const roomGeometry = new PlaneGeometry(
            window.innerWidth/50 - 2,
            window.innerWidth/50 - 2
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
        
        const room = new Mesh(roomGeometry, roomMaterial);
        room.geometry.compu;
        room.position.set(0, 0, 0);
        this.add(room);
        room.geometry.computeBoundingBox();
        room.boundingBox = room.geometry.boundingBox.clone();
    }
}

export default Land;
