import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Terrain } from './Terrain';
import { PathNode } from './PathNode';
import { Grid } from './Grid';

let container, stats;
let camera, scene, renderer;
let controls, terrain

init()

function init() {
  container = document.getElementById( 'container' );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animate );

  container.appendChild( renderer.domElement );
  
  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.set( 30, 200, 200 );
  scene = new THREE.Scene()
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  controls = new OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set( 0, 10, 0 );
  controls.minDistance = 40.0;
  controls.maxDistance = 500.0;
  controls.enableDamping = true
  controls.update();

  stats = new Stats();
  container.appendChild( stats.dom );

  window.addEventListener( 'resize', onWindowResize );

  const gui = new GUI();
  
  terrain = new Terrain(300, 300, 100, 100, 10, 1.6, 2.4, 4.3, 134, 12.2, 100)
  gui.add(terrain, 'octaves').name('Octaves').onChange(() => terrain.update());
  gui.add(terrain, 'persistence').name('Persistence').onChange(() => terrain.update());
  gui.add(terrain, 'lacunarity').name('Lacunarity').onChange(() => terrain.update());
  gui.add(terrain, 'exponentiation').name('Exponentiation').onChange(() => terrain.update());
  gui.add(terrain, 'noiseScale').name('noiseScale').onChange(() => terrain.update());
  gui.add(terrain, 'seed').name('Seed').onChange(() => terrain.update());
  gui.add(terrain, 'noiseHeight').name('noiseHeight').onChange(() => terrain.update());
  gui.add(terrain, 'height').name('Height').onChange(() => terrain.update());
  gui.add(terrain, 'width').name('Width').onChange(() => terrain.update());

  
  scene.add(terrain)
  let grid = new Grid(terrain)
  let start = Math.round(Math.random() * 100)
  let finish = Math.round(Math.random() * 10000)

  grid.children[start].material.wireframe = false
  scene.add(grid.children[start])

  grid.children[finish].material.wireframe = false
  scene.add(grid.children[finish])

  let path = grid.A_Star(grid.children[start], grid.children[finish]) 
  console.log(path);
  
  for (let i = 0; i < path.length; i++) {
    scene.add(path[i])
    
  }

  
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  render();
  stats.update();

}

function render() {

  renderer.render( scene, camera );

}


