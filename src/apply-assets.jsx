import React, { useLayoutEffect, useRef, useMemo } from 'react';

import {useFrame} from '@react-three/fiber';
import { assetPool } from './asset-pool';

function useObstacleLogic(objectRef, data, laneRef, setGameOver, playerPositionRef, onRemove, id){
    const hasCollided = useRef(false);
    const hasBeenRemoved = useRef(false);

    /**/useFrame((state, delta)=>{
        if (!objectRef.current || hasCollided.current || hasBeenRemoved.current) return;

        const obj = objectRef.current;
        if(obj.position.y < -500) return;

        const time = state.clock.elapsedTime; 
        const GAME_SPEED = Math.min((time*100), 100);
        objectRef.current.position.z += GAME_SPEED * delta;

        if(time>15){
            if(objectRef.current.position.z > -1 && objectRef.current.position.z < 1){
                const playerX = (laneRef.current - 1) * 2;
                const obstacleX = objectRef.current.position.x;
                const xDistance = Math.abs(playerX - obstacleX);

                const playerY = playerPositionRef.current.y;
                const obstacleY = objectRef.current.position.y;
                const yDistance = Math.abs(playerY-obstacleY);

                if( xDistance < 0.5 && yDistance < 0.5){
                    console.log('carp');
                    hasCollided.current = true;
                    setGameOver(true);
                }
            }
        }
        if(obj.position.z > 1.5){
            if(onRemove && !hasBeenRemoved.current){
                hasBeenRemoved.current = true;
                onRemove(id);
            }
        }
    });/**/
}

function CreateFBXElement({data, laneRef, setGameOver, playerPositionRef, onRemove}){
    const objectRef = useRef();
    
    const obj = useMemo(()=>{
        const acquiredObj = assetPool.acquire(data.source);
        if(!acquiredObj)return null;
        acquiredObj.visible = true;
        return acquiredObj;
    }, [data.source, data.id, data.position]);
    
    useLayoutEffect(()=>{
        if (!obj && onRemove) {
            onRemove(data.id);
            return;
        }

        const pos = data.position || [0, 0, 0];
        const rot = data.rotation || [0, 0, 0];
        const scl = data.scale || [1, 1, 1];

        obj.position.set(...pos);
        obj.rotation.set(...rot);
        obj.scale.set(...scl);

        objectRef.current = obj;
        return () => {
            if (obj) {
                assetPool.release(obj);
            }
        };
    }, [obj, data.position, data.rotation, data.scale, onRemove, data.id]);

    useObstacleLogic(objectRef, data, laneRef, setGameOver, playerPositionRef, onRemove, data.id);

    if(!obj) return null;

    return <primitive object={obj}/>;
}


export function AssetElement({data, laneRef, setGameOver, playerPositionRef, onRemove}){
    return(
        <group>
                <CreateFBXElement 
                    data={data}
                    laneRef={laneRef} 
                    setGameOver={setGameOver} 
                    playerPositionRef = {playerPositionRef}
                    onRemove={onRemove}
                />
        </group>
    );
}