import * as THREE from 'three';
import { PathNode } from './PathNode';

export class Grid extends THREE.Group {
    constructor(terrain) {
        super();

        this.terrain = terrain;
        this.vertices = terrain.geometry.attributes.position.array;
        this.width = terrain.width;
        this.height = terrain.height;
        this.widthSegments = terrain.widthSegments;
        this.heightSegments = terrain.heightSegments;

        for (let i = 0; i < this.vertices.length; i += 3) {
            const x = this.vertices[i];
            const y = this.vertices[i + 1];
            const z = this.vertices[i + 2];


            let vector = new THREE.Vector3(x, y, z);
            this.terrain.localToWorld(vector);

            const node = new PathNode(vector.x, vector.y, vector.z, x, y);

            this.add(node);
        }
    }

    reconstruct_path(cameFrom, current){
        //     total_path := {current}
        let totalPath = [current]
        //     while current in cameFrom.Keys:
        while(cameFrom.has(current)){
        //         current := cameFrom[current]
            current = cameFrom.get(current)
        //         total_path.prepend(current)
            totalPath.unshift(current)
        }
        //     return total_path
        return totalPath 
    }

    distance(current, neighbor) {
    
        let dx = neighbor.position.x - current.position.x;
        let dy = neighbor.position.y - current.position.y;
        let dz = neighbor.position.z - current.position.z;
    
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    }
        // A* finds a path from start to goal.
        // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
    A_Star(start, goal){
    
        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        // This is usually implemented as a min-heap or priority queue rather than a hash-set.
        let openSet = [start]
    
        // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
        // to n currently known.
        let cameFrom = new Map();
    
        // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
        //     gScore := map with default value of Infinity
        let gScore = new Map();
        gScore.set(start, 0)
    
        // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
        // how cheap a path could be from start to finish if it goes through n.
        //     fScore := map with default value of Infinity
        let fScore = new Map()
        fScore.set(start, this.distance(start, goal))
    
    
        //     while openSet is not empty
        // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
        //         current := the node in openSet having the lowest fScore[] value
        while(openSet.length > 0){
    
            let current = openSet.reduce((lowest, node) => {
                return fScore.get(node) < fScore.get(lowest) ? node : lowest
            }, openSet[0])

        //         if current = goal
        //             return reconstruct_path(cameFrom, current)
            if(current === goal){
                return this.reconstruct_path(cameFrom, current)
            }
        
        //         openSet.Remove(current)
            openSet = openSet.filter((node) => node !== current)
    
            let neighborsGridCoords = current.getNeighbors(this.width)
    
            let neighbors = []
            for (let i = 0; i < neighborsGridCoords.length; i++) {
                const node = this.children.find(child => 
                    child.gridCoords.x === neighborsGridCoords[i].x && child.gridCoords.y === neighborsGridCoords[i].y
                );
                if(node){
                    neighbors.push(node)
                } else {
                    null
                }
                
            }
        //         for each neighbor of current
    
            for(let i = 0; i < neighbors.length; i++){
        // d(current,neighbor) is the weight of the edge from current to neighbor
        // tentative_gScore is the distance from start to the neighbor through current
        //             tentative_gScore := gScore[current] + d(current, neighbor)
                if (!gScore.has(neighbors[i])) {
                    gScore.set(neighbors[i], Infinity);
                }

                let tentative_gScore = gScore.get(current) + this.distance(current, neighbors[i])

        //             if tentative_gScore < gScore[neighbor]
                if(tentative_gScore < gScore.get(neighbors[i])){
        // This path to neighbor is better than any previous one. Record it!
        //                 cameFrom[neighbor] := current
                    cameFrom.set(neighbors[i], current)
        //                 gScore[neighbor] := tentative_gScore
                    gScore.set(neighbors[i], tentative_gScore)
        //                 fScore[neighbor] := tentative_gScore + h(neighbor)
                    fScore.set(neighbors[i], tentative_gScore + this.distance(start, neighbors[i]))
        //                 if neighbor not in openSet
                    if(!openSet.includes(neighbors[i])){
        //                     openSet.add(neighbor)
                        openSet.push(neighbors[i])
                    }
                }
            }
        }
        // Open set is empty but goal was never reached
        //     return failure
        return null 
    }
    
}
