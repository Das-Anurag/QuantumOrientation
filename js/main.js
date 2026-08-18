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
    5,
    5,
    5
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
        new THREE.Vector3(
            1,
            1,
            0
        ).normalize(),

        new THREE.Vector3(
            0,
            0,
            0
        ),

        0.6,

        0xff0000
    );

scene.add(phiArrow);


// ==================================================
// 8. FIELD SETTINGS
// ==================================================

const gridSpacing = 1.5;

const gridCount = 9;

const vectorLength = 0.35;


// ==================================================
// 9. COLORS
// ==================================================

// Tail color: lighter blue

const tailColor =
    new THREE.Color(0x87CEFA);


// Head color: deep blue

const headColor =
    new THREE.Color(0x00008B);


// ==================================================
// 10. EFFECTIVE VECTOR FIELD
// ==================================================

const effectiveVectors = [];


// ==================================================
// 11. CREATE GRADIENT SHAFT
// ==================================================

function createGradientShaft(
    shaftLength
) {

    // --------------------------------------------------
    // Create cylinder geometry
    // --------------------------------------------------

    const radialSegments = 8;

    const heightSegments = 16;


    const geometry =
        new THREE.CylinderGeometry(
            0.025,
            0.025,
            shaftLength,
            radialSegments,
            heightSegments,
            false
        );


    // --------------------------------------------------
    // Create vertex colors
    // --------------------------------------------------

    const colors = [];

    const position =
        geometry.attributes.position;


    const color =
        new THREE.Color();


    // Cylinder geometry is centered around Y = 0.
    //
    // Bottom:
    //     Y = -shaftLength / 2
    //
    // Top:
    //     Y = +shaftLength / 2
    //
    // Therefore the color is calculated from Y.

    for (
        let i = 0;
        i < position.count;
        i++
    ) {

        const y =
            position.getY(i);


        let t =
            (
                y +
                shaftLength / 2
            )
            /
            shaftLength;


        // Keep t between 0 and 1

        t =
            Math.max(
                0,
                Math.min(
                    1,
                    t
                )
            );


        // Smooth interpolation

        color.copy(
            tailColor
        ).lerp(
            headColor,
            t
        );


        colors.push(
            color.r,
            color.g,
            color.b
        );
    }


    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(
            colors,
            3
        )
    );


    // --------------------------------------------------
    // Gradient material
    // --------------------------------------------------

    const material =
        new THREE.MeshBasicMaterial({
            vertexColors: true
        });


    const shaft =
        new THREE.Mesh(
            geometry,
            material
        );


    return shaft;
}


// ==================================================
// 12. CREATE EFFECTIVE VECTOR
// ==================================================

function createEffectiveVector() {

    const group =
        new THREE.Group();


    // ==================================================
    // Total vector dimensions
    // ==================================================

    const headLength =
        vectorLength * 0.28;


    const shaftLength =
        vectorLength -
        headLength;


    // ==================================================
    // Gradient shaft
    // ==================================================

    const shaft =
        createGradientShaft(
            shaftLength
        );


    group.add(
        shaft
    );


    // ==================================================
    // Deep-blue arrowhead
    // ==================================================

    const headGeometry =
        new THREE.ConeGeometry(
            0.07,
            headLength,
            10
        );


    const headMaterial =
        new THREE.MeshBasicMaterial({
            color: headColor
        });


    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );


    group.add(
        head
    );


    // ==================================================
    // Store the parts
    // ==================================================

    group.userData.shaft =
        shaft;

    group.userData.head =
        head;


    return group;
}


// ==================================================
// 13. CREATE 3D SAMPLING FIELD
// ==================================================

for (
    let ix = 0;
    ix < gridCount;
    ix++
) {

    for (
        let iy = 0;
        iy < gridCount;
        iy++
    ) {

        for (
            let iz = 0;
            iz < gridCount;
            iz++
        ) {


            const x =
                (
                    ix -
                    (gridCount - 1) / 2
                )
                *
                gridSpacing;


            const y =
                (
                    iy -
                    (gridCount - 1) / 2
                )
                *
                gridSpacing;


            const z =
                (
                    iz -
                    (gridCount - 1) / 2
                )
                *
                gridSpacing;


            // ------------------------------------------
            // Create vector
            // ------------------------------------------

            const vector =
                createEffectiveVector();


            scene.add(
                vector
            );


            // ------------------------------------------
            // Invisible hit area
            // ------------------------------------------

            const hitBox =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.10,
                        0.10,
                        vectorLength,
                        8
                    ),

                    new THREE.MeshBasicMaterial({
                        transparent: true,
                        opacity: 0
                    })
                );


            scene.add(
                hitBox
            );


            // ------------------------------------------
            // Store vector information
            // ------------------------------------------

            effectiveVectors.push({

                x: x,

                y: y,

                z: z,

                group: vector,

                hitBox: hitBox

            });
        }
    }
}


// ==================================================
// 14. RAYCASTER
// ==================================================

const raycaster =
    new THREE.Raycaster();

const pointer =
    new THREE.Vector2();


// ==================================================
// 15. VECTOR NAME DISPLAY
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
// 16. MAIN VECTOR HIT BOX
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


scene.add(
    phiHitBox
);


// ==================================================
// 17. UPDATE ONE EFFECTIVE VECTOR
// ==================================================

function updateEffectiveVector(
    data,
    phiDirection,
    a,
    b,
    c
) {


    const x =
        data.x;

    const y =
        data.y;

    const z =
        data.z;


    // ==================================================
    // r = (x-a)i + (y-b)j + (z-c)k
    // ==================================================

    const r =
        new THREE.Vector3(
            x - a,
            y - b,
            z - c
        );


    // ==================================================
    // Singular point
    // ==================================================

    if (
        r.length() === 0
    ) {

        data.group.visible =
            false;

        data.hitBox.visible =
            false;

        return;
    }


    data.group.visible =
        true;

    data.hitBox.visible =
        true;


    // ==================================================
    // r-hat
    // ==================================================

    r.normalize();


    // ==================================================
    // r-hat · Φ-hat
    // ==================================================

    const dot =
        r.dot(
            phiDirection
        );


    // ==================================================
    // φ-hat
    //
    // φ-hat =
    // 2(r-hat · Φ-hat)r-hat - Φ-hat
    // ==================================================

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


    // ==================================================
    // CENTER OF VECTOR
    // ==================================================

    data.group.position.set(
        x,
        y,
        z
    );


    // ==================================================
    // ORIENT VECTOR
    //
    // Local +Y direction becomes
    // the calculated effective direction.
    // ==================================================

    data.group.quaternion.setFromUnitVectors(
        new THREE.Vector3(
            0,
            1,
            0
        ),

        effectiveDirection
    );


    // ==================================================
    // VECTOR DIMENSIONS
    // ==================================================

    const head =
        data.group.userData.head;

    const shaft =
        data.group.userData.shaft;


    const headLength =
        vectorLength * 0.28;


    const shaftLength =
        vectorLength -
        headLength;


    // ==================================================
    // CENTER THE SHAFT
    // ==================================================

    shaft.position.y =
        -headLength / 2;


    // ==================================================
    // CENTER THE ARROWHEAD
    // ==================================================

    head.position.y =
        vectorLength / 2 -
        headLength / 2;


    // ==================================================
    // UPDATE HIT AREA
    // ==================================================

    data.hitBox.position.set(
        x,
        y,
        z
    );


    data.hitBox.quaternion.setFromUnitVectors(
        new THREE.Vector3(
            0,
            1,
            0
        ),

        effectiveDirection
    );


    // ==================================================
    // VECTOR NAME
    // ==================================================

    data.hitBox.userData.vectorName =
        "vector φ_(" +
        x.toFixed(2) +
        "," +
        y.toFixed(2) +
        "," +
        z.toFixed(2) +
        ") = (" +
        effectiveDirection.x.toFixed(3) +
        "," +
        effectiveDirection.y.toFixed(3) +
        "," +
        effectiveDirection.z.toFixed(3) +
        ")";
}


// ==================================================
// 18. UPDATE ALL VECTORS
// ==================================================

function updateVectors() {


    // ==================================================
    // Read α, β, γ
    // ==================================================

    const alpha =
        Number(
            alphaInput.value
        );

    const beta =
        Number(
            betaInput.value
        );

    const gamma =
        Number(
            gammaInput.value
        );


    // ==================================================
    // Read a, b, c
    // ==================================================

    const a =
        Number(
            posAInput.value
        );

    const b =
        Number(
            posBInput.value
        );

    const c =
        Number(
            posCInput.value
        );


    // ==================================================
    // Create Φ direction
    // ==================================================

    const phiDirection =
        new THREE.Vector3(
            alpha,
            beta,
            gamma
        );


    // Prevent zero vector

    if (
        phiDirection.length() === 0
    ) {

        phiDirection.set(
            1,
            0,
            0
        );
    }


    phiDirection.normalize();


    // ==================================================
    // Φ POSITION
    // ==================================================

    const phiPosition =
        new THREE.Vector3(
            a,
            b,
            c
        );


    // ==================================================
    // UPDATE MAIN VECTOR Φ
    // ==================================================

    phiArrow.position.copy(
        phiPosition
    );


    phiArrow.setDirection(
        phiDirection
    );


    phiArrow.setLength(
        0.6
    );


    // ==================================================
    // MAIN VECTOR HIT AREA
    // ==================================================

    phiHitBox.position.copy(
        phiPosition
    );


    phiHitBox.position.add(
        phiDirection
            .clone()
            .multiplyScalar(
                0.3
            )
    );


    phiHitBox.quaternion.setFromUnitVectors(
        new THREE.Vector3(
            0,
            1,
            0
        ),

        phiDirection
    );


    phiHitBox.userData.vectorName =
        "vector Φ_(" +
        alpha +
        "," +
        beta +
        "," +
        gamma +
        ") at (" +
        a +
        "," +
        b +
        "," +
        c +
        ")";


    // ==================================================
    // UPDATE EFFECTIVE FIELD
    // ==================================================

    for (
        const data of effectiveVectors
    ) {

        updateEffectiveVector(
            data,
            phiDirection,
            a,
            b,
            c
        );
    }
}


// ==================================================
// 19. INPUT EVENTS
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
// 20. INITIAL UPDATE
// ==================================================

updateVectors();


// ==================================================
// 21. SELECT VECTOR
// ==================================================

function selectVector(event) {


    const rect =
        renderer.domElement
            .getBoundingClientRect();


    pointer.x =
        (
            (
                event.clientX -
                rect.left
            )
            /
            rect.width
        )
        *
        2
        -
        1;


    pointer.y =
        -(
            (
                event.clientY -
                rect.top
            )
            /
            rect.height
        )
        *
        2
        +
        1;


    raycaster.setFromCamera(
        pointer,
        camera
    );


    // ==================================================
    // SELECTABLE OBJECTS
    // ==================================================

    const selectableObjects =
        [
            phiHitBox
        ];


    for (
        const data of effectiveVectors
    ) {

        if (
            data.hitBox.visible
        ) {

            selectableObjects.push(
                data.hitBox
            );
        }
    }


    // ==================================================
    // RAYCAST
    // ==================================================

    const intersections =
        raycaster.intersectObjects(
            selectableObjects,
            false
        );


    // ==================================================
    // DISPLAY NAME
    // ==================================================

    if (
        intersections.length > 0
    ) {

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
// 22. MOUSE + TOUCH
// ==================================================

renderer.domElement.addEventListener(
    "pointerdown",
    selectVector
);


// ==================================================
// 23. ANIMATION LOOP
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
// 24. WINDOW RESIZE
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
