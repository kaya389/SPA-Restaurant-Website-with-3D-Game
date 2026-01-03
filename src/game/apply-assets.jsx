import React, { useRef, useState, useEffect } from 'react';

import {useFrame} from '@react-three/fiber';

import { assetPool } from './asset-pool';
import { fbxElements } from './assets';

const rivals = [...fbxElements];

function useObstacleLogic(objectRef, data, laneRef, setGameOver, playerPositionRef, setHearts){
    const hasCollided = useRef(false);
    const hasBeenRemoved = useRef(false);

    /**/useFrame((state, delta)=>{
        if (!objectRef.current || hasBeenRemoved.current) return;

        const obj = objectRef.current;
        if(obj.position.y < -500) return;

        const time = state.clock.elapsedTime; 
        const GAME_SPEED = Math.min((time*100), 200);
        objectRef.current.position.z += GAME_SPEED * delta;

        if(time>15){
            if(objectRef.current.position.z > -1 && objectRef.current.position.z < 1){
                const playerX = (laneRef.current - 1) * 2;
                const obstacleX = objectRef.current.position.x;
                const xDistance = Math.abs(playerX - obstacleX);

                const playerY = playerPositionRef.current.y;
                const obstacleY = objectRef.current.position.y;
                const yDistance = Math.abs(playerY-obstacleY);

                if( xDistance < 1 && yDistance < 1){
                    if(data.id < 20){
                        setHearts(prevHearts=>{
                            const newHearts = prevHearts-1;
                            if(newHearts <= 0){
                                setGameOver(true);
                                return 0;
                            }
                            return newHearts;
                        });
                        hasCollided.current = true;
                        if(!hasBeenRemoved.current){
                            hasBeenRemoved.current = true;
                            assetPool.release(obj);
                        }
                    }else{
                        setHearts(prevHearts=>{
                            const newHearts = prevHearts+1;
                            return newHearts;
                        });
                        if(!hasBeenRemoved.current){
                            hasBeenRemoved.current = true;
                            assetPool.release(obj);
                        }
                    }
                }
            }
        }
        if(obj.position.z > 1.5){
            if(!hasBeenRemoved.current){
                hasBeenRemoved.current = true;
                assetPool.release(obj);
                //?obj.position.z += GAME_SPEED*delta;
            }
        }
    });/**/
}

function CreateFBXElement({data, laneRef, setGameOver, playerPositionRef, setHearts}){
    const objectRef = useRef();
    const[obj, setObj] = React.useState(null);
    
    React.useLayoutEffect(()=>{
        const acquiredObj = assetPool.acquire(data.source);

        if(!acquiredObj){
            return null;
        }

        const pos = data.position || [0, 0, 0];
        const rot = data.rotation || [0, 0, 0];
        const scl = data.scale || [1, 1, 1];

        acquiredObj.position.set(...pos);
        acquiredObj.rotation.set(...rot);
        acquiredObj.scale.set(...scl);
        
        acquiredObj.visible = true;
        objectRef.current = acquiredObj;
        setObj(acquiredObj);

        return () => {
            assetPool.release(acquiredObj);
            setObj(null);
        };
        
    }, [data.source]);

    useObstacleLogic(objectRef, data, laneRef, setGameOver, playerPositionRef, setHearts);

    if(!obj) return null;

    return <primitive object={obj}/>;
}


export function AssetElement({data, laneRef, setGameOver, playerPositionRef, onRemove, biggerThen20, setHearts}){
    const[dataId, setDataId] = useState(0);
    const intervalRef = useRef(null);
    const[notRival, setNotRival] = useState(1);

    useEffect(()=>{
        const interval = setInterval(()=>{
            setNotRival( prevNotRival =>{
                prevNotRival;
                return Math.floor(Math.random() * 4) + 1;
            });
        }, 8000);

        if(intervalRef.current){
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        if(!biggerThen20)return;

        intervalRef.current = setInterval(()=>{
            setDataId(prevDataId => {
                return prevDataId + 1;            
            });
        }, 2000);

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(interval);
            intervalRef.current = null;
        }
    }, [biggerThen20, notRival]);

    return(
        <group>
            {
            biggerThen20 ?
            (   
                dataId % 4 === 0 ? (
                <>
                <CreateFBXElement 
                    key={`loop-${dataId}`}
                    data={rivals[dataId % 20]}
                    laneRef={laneRef} 
                    setGameOver={setGameOver}
                    playerPositionRef = {playerPositionRef}
                    onRemove={onRemove}
                    setHearts={setHearts}
                />
                <CreateFBXElement 
                    key={`loop-notRival-${20+(notRival)}`}
                    data={rivals[20+(notRival)]}
                    laneRef={laneRef} 
                    setGameOver={setGameOver}
                    playerPositionRef = {playerPositionRef}
                    onRemove={onRemove}
                    setHearts={setHearts}
                />
                </>
                )
                :
                (
                <CreateFBXElement 
                    key={`loop-${dataId}`}
                    data={rivals[dataId % 20]}
                    laneRef={laneRef} 
                    setGameOver={setGameOver}
                    playerPositionRef = {playerPositionRef}
                    onRemove={onRemove}
                    setHearts={setHearts}
                />
                )
            )
            :
            (   
                dataId % 4 === 0 ?
                (
                <>
                <CreateFBXElement
                    key={`init-${data.id}`}
                    data={data}
                    laneRef={laneRef} 
                    setGameOver={setGameOver}
                    playerPositionRef = {playerPositionRef}
                    onRemove={onRemove}
                    setHearts={setHearts}
                />
                
                </>
                )
                :
                (
                <CreateFBXElement
                    key={`init-${data.id}`}
                    data={data}
                    laneRef={laneRef} 
                    setGameOver={setGameOver}
                    playerPositionRef = {playerPositionRef}
                    onRemove={onRemove}
                    setHearts={setHearts}
                />
                )
            )
            }

        </group>
    );
}