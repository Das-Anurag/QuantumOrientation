import * as THREE from "three";

import { OrbitControls }
    from "three/addons/controls/OrbitControls.js";


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

camera.position.set(10, 8, 10);

camera.lookAt(0, 0, 0);


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
    Math.min(window.devicePixelRatio, 2)
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
    5, 5, 5
);

scene.add(directionalLight);


const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.1
    );

scene.add(ambientLight);


// ==================================================
// 6. READ Φ FROM INPUT BOXES
// ==================================================

const alpha =
    Number(document.getElementById("alpha").value);

const beta =
    Number(document.getElementById("beta").value);

const gamma =
    Number(document.getElementById("gamma").value);


const a =
    Number(document.getElementById("posA").value);

const b =
    Number(document.getElementById("posB").value);

const c =
    Number(document.getElementById("posC").value);


// ==================================================
// 7. CREATE MAIN VECTOR Φ
// ==================================================

const phiDirection =
    new THREE.Vector3(
        alpha,
        beta,
        gamma
    ).normalize();


const phiPosition =
    new THREE.Vector3(
        a,
        b,
        c
    );


// ==================================================
// 8. DRAW MAIN VECTOR Φ
// ==================================================

const phiArrow =
    new THREE.ArrowHelper(
        phiDirection,
        phiPosition,
        0.6,
        0xff0000
    );

scene.add(phiArrow);


// ==================================================
// 9. TEST POSITION
// ==================================================

const x = 3;
const y = 2;
const z = 2;


// ==================================================
// 10. CREATE r̂
// ==================================================

const rUnit =
    new THREE.Vector3(
        x,
        y,
        z
    ).normalize();


// ==================================================
// 11. CALCULATE r̂ · Φ̂
// ==================================================

const dot =
    rUnit.dot(phiDirection);


// ==================================================
// 12. CALCULATE φ̂
//
// φ̂ = 2(r̂ · Φ̂)r̂ − Φ̂
// ==================================================

const phiDirectionEffective =
    rUnit
        .clone()
        .multiplyScalar(2 * dot)
        .sub(phiDirection);


// ==================================================
// 13. DRAW EFFECTIVE VECTOR
// ==================================================

const effectivePhiArrow =
    new THREE.ArrowHelper(
        phiDirectionEffective,
        new THREE.Vector3(x, y, z),
        0.6,
        0x0000ff
    );

scene.add(effectivePhiArrow);
// ==================================================
// 14. HIT AREA FOR MAIN VECTOR Φ
// ==================================================

const phiHitBox =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.15,
            0.15,
            0.6,
            12
        ),

        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0
        })
    );


// Cylinder normally points along Y-axis.
// Rotate it to point in the direction of Φ.

const yAxis =
    new THREE.Vector3(0, 1, 0);

phiHitBox.quaternion.setFromUnitVectors(
    yAxis,
    phiDirection
);


// Put the hit area at the middle of Φ.

phiHitBox.position.copy(
    phiPosition
);

phiHitBox.position.add(
    phiDirection.clone().multiplyScalar(0.3)
);


// Give the hit area the name of Φ.

phiHitBox.userData.vectorName =
    "vector Φ_(" +
    alpha + "," +
    beta + "," +
    gamma +
    ") at (" +
    a + "," +
    b + "," +
    c +
    ")";

scene.add(phiHitBox);

// ==================================================
// 15. ANIMATION
// ==================================================

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


// ==================================================
// 16. WINDOW RESIZE
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
