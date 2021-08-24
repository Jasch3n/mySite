import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import bgus from './bufferGeometryUtils.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9DC183);
scene.fog = new THREE.Fog(0x9DC183, 3, 10);

// ----------------- camera stuff ------------------------------//
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera)
camera.rotation.x += 0.5 * Math.PI;
// camera.position.z = 5;
// camera.position.y -= 1;
camera.position.z = 1;
camera.position.y -= 3;
let cameraFacing = new THREE.Vector3(0, 0, -1);
// let cameraX = new THREE.Vector3(1, 0, 0);
// let cameraY = new THREE.Vector3(0, 1, 0);
// let cameraZ = new THREE.Vector3(0, 0, 1);

camera.getWorldDirection(cameraFacing);
console.log(cameraFacing);
// We want whichever direction the camera is facing to be its "Y-axis"

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 
document.body.appendChild(renderer.domElement);

// ----------- drawing a cube ----------------//
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffc0cb, color: 0xffc0cb });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const edges = new THREE.EdgesGeometry(cubeGeometry);
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }))
cube.position.z = 1;
line.position.z = 1;
cube.castShadow = true;
scene.add(cube);
scene.add(line);

// -------------------- drawing a plane ------------------//
const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
bgus().mergeVertices(planeGeometry);
let positions = planeGeometry.attributes.position.array
let waves = [];
for (let i = 0; i < positions.length; i+=3) {
    waves.push({
        x: positions[i],
        y: positions[i + 1],
        z: positions[i + 2],
        omega: Math.random() * Math.PI * 0.1,
        amp: 0.13 + Math.random() * 0.1});
    // if ((i + 1) % 3 == 0)
    //     positions[i] += (Math.random() - 0.5) * 0.3;
}
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x00c8ff, side: THREE.DoubleSide })
// planeMaterial.color.setHSL( 0.095, 1, 0.75 );
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane)


// ---------------------- drawing a curve... of cubes -----------------//
let curveCubes = [];
for (let i = -3; i <= 3; i += 1) {
    const curveCubeGeometry = new THREE.BoxGeometry();
    const curveCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xc4c4c4 });
    const curveCube = new THREE.Mesh(curveCubeGeometry, curveCubeMaterial);
    const curveCubeEdges = new THREE.EdgesGeometry(curveCubeGeometry);
    const curveCubeLine = new THREE.LineSegments(curveCubeEdges, new THREE.LineBasicMaterial({ color: 0xffffff }))
    curveCube.add(curveCubeLine);
    curveCubes.push(curveCube);
    curveCube.position.x = i;
    curveCube.position.y = 4;
    curveCube.rotation.x += Math.random() * Math.PI / 2;
    scene.add(curveCube);
}

// ------------------------ LIGHT STUFF ---------------------- //
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 0.5);
// light.castShadow = true;
scene.add(light);
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 5);
console.log(directionalLight.position);
directionalLight.castShadow = true;
scene.add(directionalLight);

const animate = function (time) {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    line.rotation.x += 0.01;
    line.rotation.y += 0.01;
    curveCubes.forEach((cube, i) => {
        cube.rotation.x += 0.01;
        cube.position.z = 3 * Math.sin(time / 1000 + i / curveCubes.length) + 4;
    })

    const seconds = time / 1000;
    plane.geometry.attributes.position.needsUpdate = true;
    // plane.position.y += 0.01;
    let index = -1;
    let ps = plane.geometry.attributes.position.array;
    for (let i = 0; i < waves.length; i++) {
        const thisWaveInfo = waves[i];
        ps[index + 3] = thisWaveInfo.z + thisWaveInfo.amp * Math.sin(thisWaveInfo.omega * seconds) 
        // console.log(ps[index+3])
        index += 3;
    }
    // plane.position.y += 0.01;
    // if (plane.position.y >= 3) plane.position.y = 0;



    renderer.render(scene, camera);
};



// --------------- INTERACTION CODE -------------------- //
let lastMouseCoords = { x: 0, y: 0 }

const handleMouseMoveCamera = (moveEvt) => {
    const newX = moveEvt.clientX;
    const newY = moveEvt.clientY;
    const offset = { x: newX - lastMouseCoords.x, y: newY - lastMouseCoords.y };
    // camera.rotation.set(camera.rotation.x - offset.y / 700, camera.rotation.y - offset.x / 700 + (camera.rotation.x - offset.y / 700) / 700, camera.rotation.z, "ZYX");
    // camera.rotation.x -= offset.y / 700;
    camera.rotation.y -= offset.x / 700;

    camera.getWorldDirection(cameraFacing);
    console.log(cameraFacing)
    lastMouseCoords.x = newX; lastMouseCoords.y = newY;
}

document.addEventListener("mouseup", function () {
    document.removeEventListener("mousemove", handleMouseMoveCamera);
});

document.addEventListener("mousedown", function (e) {
    lastMouseCoords.x = e.clientX;
    lastMouseCoords.y = e.clientY;
    document.addEventListener("mousemove", handleMouseMoveCamera);
});

let keyState = {};

function handleKeyDown(e) {
    keyState[e.code] = true;
}

function handleKeyUp(e) {
    keyState[e.code] = false;
}

const MOVE_AMOUNT = 0.05;
function controlLoop() {
    const direction = cameraFacing.divideScalar(cameraFacing.length())
    const moveVec = direction.multiplyScalar(MOVE_AMOUNT)
    const orthogMoveVec = (new THREE.Vector2(moveVec.y, -moveVec.x))
    if (keyState["KeyW"]) {
        camera.position.x += moveVec.x;
        camera.position.y += moveVec.y;
    }
    if (keyState["KeyS"]) {
        camera.position.x -= moveVec.x;
        camera.position.y -= moveVec.y;
    }
    if (keyState["KeyA"]) {
        camera.position.x -= orthogMoveVec.x;
        camera.position.y -= orthogMoveVec.y;
    }
    if (keyState["KeyD"]) {
        camera.position.x += orthogMoveVec.x;
        camera.position.y += orthogMoveVec.y;
    }
    setTimeout(controlLoop, 10);
}
document.addEventListener("keypress", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)

animate(0);
controlLoop();