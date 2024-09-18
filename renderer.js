import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

const z = 15;
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  antialias: true ,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
let stats = new Stats();
document.body.appendChild( stats.dom );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
camera.position.set( 0, 200, 200 );
camera.lookAt(0, 0, 0);

let directionalLight = new THREE.DirectionalLight('white',3);
scene.add(directionalLight);
directionalLight.shadow.camera.left *= 5;
directionalLight.shadow.camera.right *= 5;
directionalLight.shadow.camera.top *= 5;
directionalLight.shadow.camera.bottom *= 5;
directionalLight.shadow.camera.updateProjectionMatrix();
directionalLight.castShadow = true;
directionalLight.position.set(5, 15, -5);

let ambientLight = new THREE.AmbientLight('white',.4);
scene.add(ambientLight);

let controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 40.0;
controls.maxDistance = 500.0;
controls.enableDamping = true;
let events={
  
}
let clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  let dt = clock.getDelta();
  events.frame&&events.frame(dt);
  controls.update(camera);
  renderer.render(scene, camera);
});

let handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
handleResize();
window.addEventListener('resize', handleResize, false)

export {scene,camera,renderer,controls,ambientLight,directionalLight,events}