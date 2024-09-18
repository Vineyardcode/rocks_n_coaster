import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise';

const noise2D = new createNoise2D()

export class Terrain extends THREE.Mesh {
    
    constructor(width, height, widthSegments = 100, heightSegments = 100, octaves, persistence, lacunarity, exponentiation, noiseScale, seed, noiseHeight){

        super();

        this.width = width;
        this.height = height;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.octaves = octaves;
        this.persistence = persistence;
        this.lacunarity = lacunarity;
        this.exponentiation = exponentiation;
        this.noiseScale = noiseScale;
        this.seed = seed;
        this.noiseHeight = noiseHeight;

        this.rotation.x = -Math.PI / 2;
        this.position.y = -10;

        this.update()

    }

    computeFBM(x, y) {

        const xs = x / this.noiseScale;
        const ys = y / this.noiseScale;
        const G = 2 ** (-this.persistence);
        let amplitude = 1;
        let frequency = 1;
        let normalization = 0;
        let total = 0;
        for (let o = 0; o < this.octaves; o++) {
          const noiseValue = noise2D(
              xs * frequency, ys * frequency) * 0.5 + 0.5;
          total += noiseValue * amplitude;
          normalization += amplitude;
          amplitude *= G;
          frequency *= this.lacunarity;
        }
        total /= normalization;
        return Math.pow(
            total, this.exponentiation) * this.noiseHeight;
            
    }

    update() {

        this.geometry?.dispose();
        this.material?.dispose();
    
        this.geometry = new THREE.PlaneGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
        this.material = new THREE.MeshNormalMaterial({flatShading: true});

        this.geometry.attributes.position.array.set(this.getVertices());
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.computeVertexNormals();

    }
    
    getVertices() {

        let vertices = this.geometry.attributes.position.array;
        let updatedVertices = new Float32Array(vertices.length);

        for (let i = 0; i < vertices.length; i += 3) {
            updatedVertices[i] = vertices[i];
            updatedVertices[i + 1] = vertices[i + 1];
            updatedVertices[i + 2] = this.computeFBM(vertices[i], vertices[i + 1]);
        }

        this.vertices = updatedVertices
        
        return updatedVertices;

    }

}