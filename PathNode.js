import * as THREE from 'three'

export class PathNode extends THREE.Mesh {

    constructor(x, y, z, widthCoords, heightCoords, size=3) {

        super()

        this.position.set(x,y,z) 
        this.neighbors = [];                   
        this.costFromStart = Infinity;                  
        this.heuristic = 0;                            
        this.totalCost = Infinity;                     
        this.cameFrom = null;  
        this.size = size
        this.gridCoords = {x: widthCoords, y: heightCoords};


        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size), 
        this.material = new THREE.MeshStandardMaterial({color: '#FF0000', wireframe: true})

    }

    getNeighbors() {

        const directions = [
            { x: -this.size, y: 0 },    // Left
            { x: this.size, y: 0 },     // Right
            { x: 0, y: -this.size },    // Bottom
            { x: 0, y: this.size },     // Top
            { x: -this.size, y: -this.size },   // Bottom-Left
            { x: this.size, y: -this.size },    // Bottom-Right
            { x: -this.size, y: this.size },    // Top-Left
            { x: this.size, y: this.size }      // Top-Right
        ];

        this.neighbors = [];
    
        for (let direction of directions) {

            const neighbor = {
                x: this.gridCoords.x + direction.x,
                y: this.gridCoords.y + direction.y
            };
    
            if (Math.abs(neighbor.x) <= 5 && Math.abs(neighbor.y) <= 5) {
                this.neighbors.push(neighbor);
            }
            
        }
        return this.neighbors
    }
    
    

}

