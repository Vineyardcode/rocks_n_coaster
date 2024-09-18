import * as THREE from 'three'

export class Path extends THREE.Group {
    constructor(start, finish, grid){

        super();

        let path = grid.A_Star(start, finish) 

        for (let i = 0; i < path.length; i++){
          this.add(path[i])
        }
      
    }
}