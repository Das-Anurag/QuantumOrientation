import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(400, 300);

document.body.appendChild(renderer.domElement);

document.body.innerHTML +=
    "<p>Renderer created successfully!</p>";
