import * as THREE from "three";

// ----------------------------------------
// 1. Scene
// ----------------------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);


// ----------------------------------------
// 2. Camera
// ----------------------------------------

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(5, 5, 5);

camera.lookAt(0, 0, 0);


// ----------------------------------------
// 3. Renderer
// ----------------------------------------

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(
    renderer.domElement
);


// ----------------------------------------
// 4. Render
// ----------------------------------------

renderer.render(
    scene,
    camera
);
