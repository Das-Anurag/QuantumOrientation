import * as THREE from "three";

import { OrbitControls }
    from "three/addons/controls/OrbitControls.js";

import { Vector3 }
    from "./functions.js";


// ----------------------------------------
// 1. Test our mathematical Vector3 class
// ----------------------------------------

const Phi = new Vector3(1, 2, 3);

console.log("Phi =", Phi.show());
console.log("Length of Phi =", Phi.length());


// ----------------------------------------
// 2. Create the Three.js Scene
// ----------------------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);


// ----------------------------------------
// 3. Create the Camera
// ----------------------------------------

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(10, 8, 10);

camera.lookAt(0, 0, 0);


// ----------------------------------------
// 4. Create the Renderer
// ----------------------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(
    renderer.domElement
);


// ----------------------------------------
// 5. OrbitControls
// ----------------------------------------

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;


// ----------------------------------------
// 6. Coordinate Axes
// ----------------------------------------

const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper);


// ----------------------------------------
// 7. Lighting
// ----------------------------------------

const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        1
    );

directionalLight.position.set(
    5,
    5,
    5
);

scene.add(directionalLight);


const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.1
    );

scene.add(ambientLight);


// ----------------------------------------
// 8. Animation Loop
// ----------------------------------------

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


// ----------------------------------------
// 9. Window Resize
// ----------------------------------------

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
