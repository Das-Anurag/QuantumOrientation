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
// 8. ARRAYS FOR EFFECTIVE VECTORS
// ==================================================

const effectivePhiArrows = [];

const effectivePhiHitBoxes = [];


// ==================================================
// 9. CREATE THE 3 × 3 × 3 FIELD
// ==================================================

const gridValues = [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1 0,1,2,3,4,5,6,7,8,9,10];

for (let x of gridValues) {

    for (let y of gridValues) {

        for (let z of gridValues) {

            // The point (a,b,c) will be checked
            // later because r = 0 there.

            const arrow =
                new THREE.ArrowHelper(
                    new THREE.Vector3(1, 0, 0),
                    new THREE.Vector3(x, y, z),
                    0.6,
                    0x0000ff
                );

            scene.add(arrow);

            effectivePhiArrows.push({
                arrow: arrow,
                x: x,
                y: y,
                z: z
            });


            // --------------------------------------
            // Invisible hit area
            // --------------------------------------

            const hitBox =
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

            scene.add(hitBox);

            effectivePhiHitBoxes.push({
                mesh: hitBox,
                x: x,
                y: y,
                z: z
            });
        }
    }
}


// ==================================================
// 10. RAYCASTER
// ==================================================

const raycaster =
    new THREE.Raycaster();

const pointer =
    new THREE.Vector2();


// ==================================================
// 11. VECTOR NAME DISPLAY
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
// 12. UPDATE ALL VECTORS
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
    // Read Φ position (a,b,c)
    // ----------------------------------------------

    const a =
        Number(posAInput.value);

    const b =
        Number(posBInput.value);

    const c =
        Number(posCInput.value);


    // ----------------------------------------------
    // Create Φ direction
    // ----------------------------------------------

    const phiDirection =
        new THREE.Vector3(
            alpha,
            beta,
            gamma
        );


    // Avoid zero direction

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
    // Update main vector Φ
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
    // Update Φ hit area
    // ----------------------------------------------

    if (!window.phiHitBox) {

        window.phiHitBox =
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

        scene.add(
            window.phiHitBox
        );
    }


    const phiHitBox =
        window.phiHitBox;


    phiHitBox.position.copy(
        phiPosition
    );

    phiHitBox.position.add(
        phiDirection
            .clone()
            .multiplyScalar(0.3)
    );


    phiHitBox.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        phiDirection
    );


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
    // Update every effective vector
    // ----------------------------------------------

    for (
        let i = 0;
        i < effectivePhiArrows.length;
        i++
    ) {

        const data =
            effectivePhiArrows[i];

        const hitData =
            effectivePhiHitBoxes[i];


        const x =
            data.x;

        const y =
            data.y;

        const z =
            data.z;


        // ------------------------------------------
        // r = (x-a)i + (y-b)j + (z-c)k
        // ------------------------------------------

        const r =
            new THREE.Vector3(
                x - a,
                y - b,
                z - c
            );


        // ------------------------------------------
        // r = 0 means unit r is undefined
        // ------------------------------------------

        if (r.length() === 0) {

            data.arrow.visible = false;

            hitData.mesh.visible = false;

            continue;
        }


        data.arrow.visible = true;

        hitData.mesh.visible = true;


        // ------------------------------------------
        // Unit vector r̂
        // ------------------------------------------

        r.normalize();


        // ------------------------------------------
        // r̂ · Φ̂
        // ------------------------------------------

        const dot =
            r.dot(
                phiDirection
            );


        // ------------------------------------------
        // φ̂ =
        // 2(r̂ · Φ̂)r̂ - Φ̂
        // ------------------------------------------

        const effectiveDirection =
            r
                .clone()
                .multiplyScalar(
                    2 * dot
                )
                .sub(
                    phiDirection
                )
                .normalize();


        // ------------------------------------------
        // Update visible arrow
        // ------------------------------------------

        data.arrow.position.set(
            x,
            y,
            z
        );

        data.arrow.setDirection(
            effectiveDirection
        );

        data.arrow.setLength(
            0.6
        );


        // ------------------------------------------
        // Update hit area
        // ------------------------------------------

        const hitBox =
            hitData.mesh;


        hitBox.position.set(
            x,
            y,
            z
        );

        hitBox.position.add(
            effectiveDirection
                .clone()
                .multiplyScalar(0.3)
        );


        hitBox.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            effectiveDirection
        );


        // ------------------------------------------
        // Name
        // ------------------------------------------

        hitBox.userData.vectorName =
            "vector φ_(" +
            x + "," +
            y + "," +
            z +
            ") = (" +
            effectiveDirection.x.toFixed(3) +
            "," +
            effectiveDirection.y.toFixed(3) +
            "," +
            effectiveDirection.z.toFixed(3) +
            ")";
    }
}


// ==================================================
// 13. INPUT EVENTS
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
// 14. INITIAL CALCULATION
// ==================================================

updateVectors();


// ==================================================
// 15. SELECT VECTOR
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


    const objectsToCheck = [
        window.phiHitBox
    ];


    for (
        const hitData
        of effectivePhiHitBoxes
    ) {

        objectsToCheck.push(
            hitData.mesh
        );
    }


    const intersections =
        raycaster.intersectObjects(
            objectsToCheck,
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
// 16. MOUSE + TOUCH
// ==================================================

renderer.domElement.addEventListener(
    "pointerdown",
    selectVector
);


// ==================================================
// 17. ANIMATION LOOP
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
// 18. WINDOW RESIZE
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
