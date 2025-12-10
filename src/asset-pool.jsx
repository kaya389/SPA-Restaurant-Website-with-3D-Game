import * as THREE from 'three';
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

class AssetPool{
    constructor(){
        this.pools = {};
        this.materials = {};
    }

    getMaterial(texture){
        const key = texture.uuid;
        if(!this.materials[key]){
            this.materials[key] = new THREE.MeshStandardMaterial({
                map: texture
            });
        }
        return this.materials[key];
    }

    preparePool(source, fbx, texture){
        if(this.pools[source]) return;

        this.pools[source] = [];
        const material = this.getMaterial(texture);

        const clone = SkeletonUtils.clone(fbx);

        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        clone.userData = {
            inUse: false,
            poolSource: source
        };

        clone.position.set(0, -1000, 0);
        this.pools[source].push(clone);
        console.log(`✅ Pool hazır: ${source}`);
    }

    acquire(source){
        const pool = this.pools[source];
        if(!pool) return null;

        const free = pool.find(obj => !obj.userData.inUse);
        if(free){
            free.userData.inUse = true;
            return free;
        }
        console.warn(`⚠️ Pool dolu: ${source}`);
        return null;
    }

    release(object){
        if(!object || !object.userData) return;

        object.userData.inUse = false;
        object.position.set(0, 0, -505)
        
    }
    
    dispose(){
        Object.values(this.pools).forEach(pool=>{
            pool.forEach(obj=>{
                obj.traverse((child)=>{
                    if(child.geometry)child.geometry.dispose();
                });
            });
        });
        Object.values(this.materials).forEach(mat=>{
            if(mat.map) mat.map.dispose();
            mat.dispose();
        })

        this.pools = {};
        this.materials = {};
    }
}

export const assetPool = new AssetPool();