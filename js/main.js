import * as THREE from "three";

import { OrbitControls }
    from "three/addons/controls/OrbitControls.js";

import { Vector3 }
    from "./functions.js";


// ==================================================
// 1. SCENE
// ==================================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x87CEEB);


// ==================================================
// 2. CAMERA
// ==================================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    10,
    8,
    10
);

camera.lookAt(
    0,
    0,
    0
);


// ==================================================
// 3. RENDERER
// ==================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

document.body.appendChild(
    renderer.domElement
);


// ==================================================
// 4. ORBIT CONTROLS
// ==================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;


// ==================================================
// 5. LIGHTING
// ==================================================

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

scene.add(
    directionalLight
);


const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.1
    );

scene.add(
    ambientLight
);


// ==================================================
// 7. READ Φ FROM INPUT BOXES
// ==================================================

const alphaInput =
    document.getElementById("alpha");

const betaInput =
    document.getElementById("beta");

const gammaInput =
    document.getElementById("gamma");


const posAInput =
    document.getElementById("posA");

const posBInput =
    document.getElementById("posB");

const posCInput =
    document.getElementById("posC");


// ==================================================
// 8. CREATE MATHEMATICAL VECTOR Φ
// ==================================================

const phiDirection =
    new Vector3(
        Number(alphaInput.value),
        Number(betaInput.value),
        Number(gammaInput.value)
    );


const phiPosition =
    new Vector3(
        Number(posAInput.value),
        Number(posBInput.value),
        Number(posCInput.value)
    );


// ==================================================
// 9. CONVERT OUR Vector3 TO THREE.Vector3
// ==================================================

const phiDirectionThree =
    new THREE.Vector3(
        phiDirection.x,
        phiDirection.y,
        phiDirection.z
    ).normalize();


const phiPositionThree =
    new THREE.Vector3(
        phiPosition.x,
        phiPosition.y,
        phiPosition.z
    );


// ==================================================
// 10. CREATE THE MAIN VECTOR Φ
// ==================================================

const phiArrow =
    new THREE.ArrowHelper(
        phiDirectionThree,
        phiPositionThree,
        5,
        0xff0000
    );

scene.add(
    phiArrow
);


// ==================================================
// 11. INVISIBLE HIT AREA FOR Φ
// ==================================================

const phiHitBox =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.35,
            16,
            16
        ),

        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0
        })
    );

phiHitBox.position.copy(
    phiPositionThree
);

phiHitBox.userData.vectorName =
    "vector Φ_(" +
    alphaInput.value + "," +
    betaInput.value + "," +
    gammaInput.value +
    ") at (" +
    posAInput.value + "," +
    posBInput.value + "," +
    posCInput.value +
    ")";

scene.add(
    phiHitBox
);


// ==================================================
// 12. RAYCASTER
// ==================================================

const raycaster =
    new THREE.Raycaster();

const pointer =
    new THREE.Vector2();


// ==================================================
// 13. VECTOR NAME DISPLAY
// ==================================================

const vectorLabel =
    document.createElement("div");

vectorLabel.style.position =
    "fixed";

vectorLabel.style.left =
    "50%";

vectorLabel.style.bottom =
    "20px";

vectorLabel.style.transform =
    "translateX(-50%)";

vectorLabel.style.padding =
    "8px 12px";

vectorLabel.style.background =
    "rgba(0, 0, 0, 0.75)";

vectorLabel.style.color =
    "white";

vectorLabel.style.fontFamily =
    "Arial";

vectorLabel.style.fontSize =
    "16px";

vectorLabel.style.borderRadius =
    "6px";

vectorLabel.style.zIndex =
    "100";

vectorLabel.style.display =
    "none";

document.body.appendChild(
    vectorLabel
);


// ==================================================
// 14. SELECT VECTOR
// ==================================================

function selectVector(event) {

    const rect =
        renderer.domElement.getBoundingClientRect();


    pointer.x =
        (
            (event.clientX - rect.left)
            /
            rect.width
        ) * 2 - 1;


    pointer.y =
        -(
            (event.clientY - rect.top)
            /
            rect.height
        ) * 2 + 1;


    raycaster.setFromCamera(
        pointer,
        camera
    );


    const intersections =
        raycaster.intersectObjects(
            [phiHitBox],
            false
        );


    if (intersections.length > 0) {

        vectorLabel.textContent =
            intersections[0]
                .object
                .userData
                .vectorName;

        vectorLabel.style.display =
            "block";

    }

    else {

        vectorLabel.style.display =
            "none";

    }
}


// ==================================================
// 15. MOUSE + TOUCH
// ==================================================

renderer.domElement.addEventListener(
    "pointerdown",
    selectVector
);


// ==================================================
// 16. ANIMATION LOOP
// ==================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


// ==================================================
// 17. WINDOW RESIZE
// ==================================================

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
