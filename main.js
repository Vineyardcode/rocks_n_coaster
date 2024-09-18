import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Terrain } from './Terrain';
import { Grid } from './Grid';
import { Path } from './Path';
import {
  scene,
  camera,
  renderer,
  controls,
  ambientLight,
  directionalLight,
  events,
} from "./renderer.js";


let terrain, grid;
let raycaster, mouse, gui;
let start = null
let finish = null
let path;
let currentState = 'selectStart'; 

init()

function init() {

  gui = new GUI();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  terrain = new Terrain(300, 300, 100, 100, 10, 1.6, 2.4, 4.3, 100, 12.2, 100)
  gui.add(terrain, 'octaves').name('Octaves').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'persistence').name('Persistence').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'lacunarity').name('Lacunarity').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'exponentiation').name('Exponentiation').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'noiseScale').name('Noise Scale').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'seed').name('Seed').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'noiseHeight').name('Noise Height').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'height').name('Height').onChange(() => {
    terrain.update();
    updateGrid();
  });
  gui.add(terrain, 'width').name('Width').onChange(() => {
    terrain.update();
    updateGrid();
  });

  scene.add(terrain)
  
  grid = new Grid(terrain);  
  grid.visible = false
  scene.add(grid);  

  renderer.domElement.addEventListener('click', onClick, false);

}

function onClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0) {
    let object = intersects[0].object;
    
    if (currentState === 'selectStart') {
      handleStartSelection(object);
    } else if (currentState === 'selectFinish') {
      handleFinishSelection(object);
    }
  }

}

function handleStartSelection(object) {
  if(path){
    scene.remove(path)
  }
  
  object.visible = true;
  object.material.wireframe = false;
  scene.add(object)
  start = object;
  currentState = 'selectFinish'; 
  
}

function updateGrid() {
  if (grid) {
    scene.remove(grid); 
  }
  if(path){
    scene.remove(path)
  }
  
  grid = new Grid(terrain);  
  grid.visible = false
  scene.add(grid);  
}

function handleFinishSelection(object) {
  object.visible = true;
  object.material.wireframe = false;
  finish = object

  if (start && finish) {
    
    try {


      path = new Path(start, finish, grid)
      scene.add(path)

      // path = grid.A_Star(start, finish) 

      // for (let i = 0; i < path.length; i++){
      //   scene.add(path[i])
      // }
    

    } catch (error) {
      console.error("Error creating path:", error);
    }

    start = null;
    finish = null;
    currentState = 'selectStart'; 
  }
}

