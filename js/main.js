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

const phiArrow =
    new THREE.ArrowHelper(
        new THREE.Vector3(1, 1, 0).normalize(),
        new THREE.Vector3(0, 0, 0),
        0.6,
        0xff0000
    );

scene.add(phiArrow);


// ==================================================
// 8. TEST POSITION OF EFFECTIVE VECTOR
// ==================================================

const x = 3;
const y = 2;
const z = 2;


// ==================================================
// 9. EFFECTIVE VECTOR φ
// ==================================================

const effectivePhiArrow =
    new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(x, y, z),
        0.6,
        0x0000ff
    );

scene.add(effectivePhiArrow);


// ==================================================
// 10. HIT AREA FOR MAIN VECTOR Φ
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

scene.add(phiHitBox);


// ==================================================
// 11. HIT AREA FOR EFFECTIVE VECTOR φ
// ==================================================

const effectivePhiHitBox =
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

scene.add(effectivePhiHitBox);


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
// 14. UPDATE ALL VECTOR DATA
// ==================================================

function updateVectors() {

    // ----------------------------------------------
    // Read Φ direction
    // ----------------------------------------------

    const alpha =
        Number(alphaInput.value);

    const beta =
        Number(betaInput.value);

    const gamma =
        Number(gammaInput.value);


    // ----------------------------------------------
    // Read Φ position
    // ----------------------------------------------

    const a =
        Number(posAInput.value);

    const b =
        Number(posBInput.value);

    const c =
        Number(posCInput.value);


    // ----------------------------------------------
    // Create normalized Φ
    // ----------------------------------------------

    const phiDirection =
        new THREE.Vector3(
            alpha,
            beta,
            gamma
        );


    // Prevent division by zero
    if (phiDirection.length() === 0) {

        phiDirection.set(
            1,
            0,
            0
        );

    }

    phiDirection.normalize();


    // ----------------------------------------------
    // Create Φ position
    // ----------------------------------------------

    const phiPosition =
        new THREE.Vector3(
            a,
            b,
            c
        );


    // ----------------------------------------------
    // Update visible Φ
    // ----------------------------------------------

    phiArrow.position.copy(
        phiPosition
    );

    phiArrow.setDirection(
        phiDirection
    );

    phiArrow.setLength(
        0.6
    );


    // ----------------------------------------------
    // Create r̂_(x,y,z)
    // ----------------------------------------------

    const rUnit =
        new THREE.Vector3(
            x,
            y,
            z
        );


    // Position (0,0,0) is not allowed
    // because its unit vector is undefined.

    if (rUnit.length() === 0) {
        return;
    }

    rUnit.normalize();


    // ----------------------------------------------
    // Calculate r̂ · Φ̂
    // ----------------------------------------------

    const dot =
        rUnit.dot(
            phiDirection
        );


    // ----------------------------------------------
    // Calculate effective φ̂
    //
    // φ̂ = 2(r̂ · Φ̂)r̂ − Φ̂
    // ----------------------------------------------

    const phiDirectionEffective =
        rUnit
            .clone()
            .multiplyScalar(
                2 * dot
            )
            .sub(
                phiDirection
            )
            .normalize();


    // ----------------------------------------------
    // Update visible effective vector
    // ----------------------------------------------

    effectivePhiArrow.position.set(
        x,
        y,
        z
    );

    effectivePhiArrow.setDirection(
        phiDirectionEffective
    );

    effectivePhiArrow.setLength(
        0.6
    );


    // ----------------------------------------------
    // Position Φ hit area
    // ----------------------------------------------

    phiHitBox.position.copy(
        phiPosition
    );

    phiHitBox.position.add(
        phiDirection
            .clone()
            .multiplyScalar(0.3)
    );


    // Orient Φ hit area

    phiHitBox.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        phiDirection
    );


    // ----------------------------------------------
    // Name of Φ
    // ----------------------------------------------

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


    // ----------------------------------------------
    // Position effective-vector hit area
    // ----------------------------------------------

    effectivePhiHitBox.position.set(
        x,
        y,
        z
    );

    effectivePhiHitBox.position.add(
        phiDirectionEffective
            .clone()
            .multiplyScalar(0.3)
    );


    // Orient effective hit area

    effectivePhiHitBox.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        phiDirectionEffective
    );


    // ----------------------------------------------
    // Name of effective vector
    // ----------------------------------------------

    effectivePhiHitBox.userData.vectorName =
        "vector φ_(" +
        x + "," +
        y + "," +
        z +
        ") = (" +
        phiDirectionEffective.x.toFixed(3) +
        "," +
        phiDirectionEffective.y.toFixed(3) +
        "," +
        phiDirectionEffective.z.toFixed(3) +
        ")";
}


// ==================================================
// 15. INPUT EVENT
// ==================================================

alphaInput.addEventListener(
    "input",
    updateVectors
);

betaInput.addEventListener(
    "input",
    updateVectors
);

gammaInput.addEventListener(
    "input",
    updateVectors
);

posAInput.addEventListener(
    "input",
    updateVectors
);

posBInput.addEventListener(
    "input",
    updateVectors
);

posCInput.addEventListener(
    "input",
    updateVectors
);


// ==================================================
// 16. INITIAL UPDATE
// ==================================================

updateVectors();


// ==================================================
// 17. SELECT VECTOR
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
            [
                phiHitBox,
                effectivePhiHitBox
            ],
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
// 18. MOUSE + TOUCH
// ==================================================

renderer.domElement.addEventListener(
    "pointerdown",
    selectVector
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
