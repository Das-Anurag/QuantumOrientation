import * as THREE from "three";

import { OrbitControls }
    from "three/addons/controls/OrbitControls.js";


// Create Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);


// Create Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(10, 8, 10);
camera.lookAt(0, 0, 0);


// Create Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(
    renderer.domElement
);


// OrbitControls
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;


// Axes
const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper);


// Animation
function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();
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
