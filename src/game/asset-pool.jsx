import * as THREE from 'three';
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

class AssetPool{
    constructor(){
        this.pools = {};
    }

    preparePool(source, clone){
        if(this.pools[source]) return;

        this.pools[source] = [];

        clone.userData = {
            inUse: false,
            poolSource: source
        };

        clone.position.set(0, -1000, 0);
        this.pools[source].push(clone);
    }

    acquire(source){
        const pool = this.pools[source];
        if(!pool) return null;

        const free = pool.find(obj => !obj.userData.inUse);
        if(free){
            free.userData.inUse = true;
            return free;
        }
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
                    if(child.material){
                        if(Array.isArray(child.material)){
                            child.material.forEach(m=>m.dispose);
                        }else{
                            child.material.dispose();
                        }
                    }
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
    reset() {
        this.pools = {};
        this.materials = {};
    }
}

export const assetPool = new AssetPool();