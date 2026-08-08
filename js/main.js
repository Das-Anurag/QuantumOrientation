import * as THREE from "three";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(400, 300);

document.body.appendChild(renderer.domElement);

renderer.render(scene, new THREE.Camera());

document.body.innerHTML +=
    "<p>Scene rendered successfully!</p>";
