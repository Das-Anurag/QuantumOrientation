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

const renderer =
    new THREE.WebGLRenderer({
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

const controls =
    new OrbitControls(
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
// 6. INPUT BOXES
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
// 7. MAIN VECTOR Φ
// ==================================================

const phiDirection =
    new Vector3(
        Number(alphaInput.value),
        Number(betaInput.value),
        Number(gammaInput.value)
    ).normalize();


// ==================================================
// 8. MAIN VECTOR Φ POSITION
// ==================================================

const phiPosition =
    new Vector3(
        Number(posAInput.value),
        Number(posBInput.value),
        Number(posCInput.value)
    );


// ==================================================
// 9. CONVERT Φ TO THREE.Vector3
// ==================================================

const phiDirectionThree =
    new THREE.Vector3(
        phiDirection.x,
        phiDirection.y,
        phiDirection.z
    );

const phiPositionThree =
    new THREE.Vector3(
        phiPosition.x,
        phiPosition.y,
        phiPosition.z
    );


// ==================================================
// 10. DRAW MAIN VECTOR Φ
// ==================================================

const phiArrow =
    new THREE.ArrowHelper(
        phiDirectionThree,
        phiPositionThree,
        2,
        0xff0000
    );

scene.add(
    phiArrow
);


// ==================================================
// 11. TEST POSITION (x,y,z)
// ==================================================

// We choose one position for testing.

const x = 3;
const y = 2;
const z = 2;


// ==================================================
// 12. CREATE r_(x,y,z)
// ==================================================

const r =
    new Vector3(
        x,
        y,
        z
    );


// ==================================================
// 13. CREATE UNIT VECTOR r̂_(x,y,z)
// ==================================================

const rUnit =
    r.normalize();


// ==================================================
// 14. CALCULATE r̂ · Φ̂
// ==================================================

const dot =
    rUnit.dot(
        phiDirection
    );


// ==================================================
// 15. CALCULATE EFFECTIVE UNIT VECTOR φ̂
//
// φ̂ = 2(r̂ · Φ̂)r̂ - Φ̂
// ==================================================

const phi =
    rUnit
        .multiplyScalar(
            2 * dot
        )
        .subtract(
            phiDirection
        );


// ==================================================
// 16. CONVERT φ̂ TO THREE.Vector3
// ==================================================

const phiThree =
    new THREE.Vector3(
        phi.x,
        phi.y,
        phi.z
    );


// ==================================================
// 17. DRAW SMALL EFFECTIVE VECTOR
// ==================================================

const phiArrow =
    new THREE.ArrowHelper(
        phiThree,
        new THREE.Vector3(
            x,
            y,
            z
        ),
        0.8,
        0x0000ff
    );

scene.add(
    phiArrow
);


// ==================================================
// 18. SHOW CALCULATED VALUE
// ==================================================

console.log(
    "r̂ =",
    rUnit.show()
);

console.log(
    "r̂ · Φ̂ =",
    dot
);

console.log(
    "φ̂ =",
    phi.show()
);


// ==================================================
// 19. ANIMATION LOOP
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
// 20. WINDOW RESIZE
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
