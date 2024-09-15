//  pseudocode source: https://en.wikipedia.org/wiki/A*_search_algorithm
// const foundChild1 = grid.children.filter(child => 
//     child.gridCoords.x ===  && child.gridCoords.y === 
// );


function reconstruct_path(cameFrom, current){
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

    // A* finds a path from start to goal.
    // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start, goal){

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
    fScore.set(start, distance(start, goal))


    //     while openSet is not empty
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    //         current := the node in openSet having the lowest fScore[] value
    while(openSet.length > 0){

        let current = openSet.reduce((lowest, node) => {
            return fScore.get(node) < fScore.get(lowest) ? node : lowest
        }, openSet[0])
        console.log(current.getNeighbors());

    //         if current = goal
    //             return reconstruct_path(cameFrom, current)
        if(current === goal){
            return reconstruct_path(cameFrom, current)
            break
        }
        
    //         openSet.Remove(current)
        openSet = openSet.filter((node) => node !== current)

        let neighborsGridCoords = current.getNeighbors()

        let neighbors = []
        for (let i = 0; i < neighbors.length; i++) {
            const node = grid.children.filter(child => 
                child.gridCoords.x === -144 && child.gridCoords.y === 150
            );
            
        }


    //         for each neighbor of current

        for(let i = 0; i < neighbors.length; i++){
    // d(current,neighbor) is the weight of the edge from current to neighbor
    // tentative_gScore is the distance from start to the neighbor through current
    //             tentative_gScore := gScore[current] + d(current, neighbor)
            
            let tentative_gScore = gScore.get(current) + h(current, neighbors[i])
    //             if tentative_gScore < gScore[neighbor]
            if(tentative_gScore < gScore.get(neighbors[i]) || Infinity){
    // This path to neighbor is better than any previous one. Record it!
    //                 cameFrom[neighbor] := current
                cameFrom.set(neighbors[i], current)
    //                 gScore[neighbor] := tentative_gScore
                gScore.set(neighbors[i], tentative_gScore)
    //                 fScore[neighbor] := tentative_gScore + h(neighbor)
                fScore.set(neighbors[i], tentative_gScore + h(start, neighbors[i]))
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

function distance(current, neighbor) {

    let dx = neighbor.position.x - current.position.x;
    let dy = neighbor.position.y - current.position.y;
    let dz = neighbor.position.z - current.position.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);

}

function h(current, neighbor) {


    let dx = neighbor.x - current.position.x;
    let dy = neighbor.y - current.position.y;
    let dz = neighbor.z - current.position.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);

}




export { A_Star, reconstruct_path, distance };
