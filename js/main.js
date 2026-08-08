import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(400, 300);

renderer.setClearColor(0x87CEEB);

document.body.appendChild(renderer.domElement);

renderer.clear();
