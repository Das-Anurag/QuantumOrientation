import * as THREE from "three";
import { OrbitControls }
    from "three/addons/controls/OrbitControls.js";

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

camera.position.set(10, 8, 10);

camera.lookAt(0, 0, 0);


// ----------------------------------------
// 3. Renderer
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
// 4. Create an axis
// ----------------------------------------

function createAxis(
    direction,
    color,
    positiveLabel,
    negativeLabel
) {

    const length = 5;

    // Positive direction
    const positiveDirection =
        direction.clone().normalize();

    const positiveArrow =
        new THREE.ArrowHelper(
            positiveDirection,
            new THREE.Vector3(0, 0, 0),
            length,
            color,
            0.25,
            0.12
        );

    scene.add(positiveArrow);


    // Negative direction
    const negativeDirection =
        direction.clone()
        .multiplyScalar(-1)
        .normalize();

    const negativeArrow =
        new THREE.ArrowHelper(
            negativeDirection,
            new THREE.Vector3(0, 0, 0),
            length,
            color,
            0.25,
            0.12
        );

    scene.add(negativeArrow);


    // Positive label
    createLabel(
        positiveLabel,
        positiveDirection.clone().multiplyScalar(length + 0.4),
        color
    );


    // Negative label
    createLabel(
        negativeLabel,
        negativeDirection.clone().multiplyScalar(length + 0.4),
        color
    );
}


// ----------------------------------------
// 5. Create a 3D text label
// ----------------------------------------

function createLabel(
    text,
    position,
    color
) {

    const canvas =
        document.createElement("canvas");

    const context =
        canvas.getContext("2d");

    canvas.width = 128;
    canvas.height = 128;

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    context.font = "bold 60px Arial";

    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillStyle =
        "#" + color.toString(16).padStart(6, "0");

    context.fillText(
        text,
        64,
        64
    );


    const texture =
        new THREE.CanvasTexture(canvas);

    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

    const sprite =
        new THREE.Sprite(material);

    sprite.position.copy(position);

    sprite.scale.set(
        0.8,
        0.8,
        0.8
    );

    scene.add(sprite);
}


// ----------------------------------------
// 6. Create the coordinate axes
// ----------------------------------------

// X-axis
createAxis(
    new THREE.Vector3(1, 0, 0),
    0xff0000,
    "x",
    "x′"
);


// Y-axis
createAxis(
    new THREE.Vector3(0, 1, 0),
    0x00ff00,
    "y",
    "y′"
);


// Z-axis
createAxis(
    new THREE.Vector3(0, 0, 1),
    0x0000ff,
    "z",
    "z′"
);


// ----------------------------------------
// 7. OrbitControls
// ----------------------------------------

import { OrbitControls }
    from "three/addons/controls/OrbitControls.js";

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping = true;


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
