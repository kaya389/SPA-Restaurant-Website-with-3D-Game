import React, {useEffect, useRef, Suspense, useState} from 'react';

import {Canvas, useFrame} from '@react-three/fiber';
import {useFBX, Environment} from '@react-three/drei';
import * as THREE from 'three';

import {Player} from './player.jsx';
import {Ground} from './ground.jsx';
import {AssetElement} from './apply-assets.jsx';

import dialogBox from '../images/dialog-box.png';
import './game.css';

import { fbxElements } from './assets';
import { AssetLoader } from './asset-loader.jsx';

const rivals = [...fbxElements];
const toPreload = [];

rivals.forEach((element, index)=>{
    toPreload[index] = element.source; 
});

toPreload.forEach((path)=>{
    useFBX.preload(path);
});

useFBX.preload('/cockatrice.fbx');

function RivalManager( {laneRef, setGameOver, playerPositionRef}){

    const[spawnedRivals, setSpawnedRivals] = useState([]);

    const[poolReady, setPoolReady] = useState(false);

    const timeRef = useRef(0);

    const MAX_ACTIVE = 3;

    const removeRival = (idToRemove)=>{
        console.log('Siliniyor:', idToRemove, 'Toplam:', spawnedRivals.length);
        setSpawnedRivals((prevList)=>{
            console.log('📊 ÖNCESİ - Array uzunluğu:', prevList.length);
            console.log('📊 ÖNCESİ - ID\'ler:', prevList.map(r => r.id));
            const filtered = prevList.filter((rival)=>rival.id !== idToRemove);
            console.log('✅ SONRASI - Array uzunluğu:', filtered.length);
            console.log('✅ SONRASI - ID\'ler:', filtered.map(r => r.id));
            return filtered;
        })
    }

    useFrame((state, delta)=>{
        if(!poolReady) return;

        timeRef.current += delta;

        if(timeRef.current > 1){
            timeRef.current = 0;

            if(spawnedRivals.length >= 1) return;

            let randomIndex = Math.floor(Math.random() * 21);

            const uniqueId = Date.now() + Math.random();

            const newRival = {
                ...rivals[randomIndex],
                id: uniqueId
            }

            setSpawnedRivals((prev)=>[...prev, newRival])
        }
    });

    return(
        <>
        <AssetLoader
            rivals={rivals}
            onReady={()=> setPoolReady(true)}
        />
        {poolReady && spawnedRivals.map((rival)=>(
            <AssetElement
                key={rival.id}
                data={rival}
                laneRef={laneRef}
                setGameOver = {setGameOver}
                playerPositionRef = {playerPositionRef}
                onRemove={()=>{removeRival(rival.id)}}
            />
        ))}
        </>
    );
}

export function Game({ onRestart }){
    const [showImage, setShowImage] = useState(true);
    const laneRef = useRef(1);

    const jumpTriggerRef = useRef(false);
    
    const canMove = useRef(true);

    const [canDie, setCanDie] = useState(false);

    const playerPositionRef = useRef(new THREE.Vector3());

    useEffect(()=>{
        const timerId = setTimeout(() => {
            setShowImage(false);
        }, 10000);

        setTimeout(() => {
            setCanDie(true);
        }, 15000);

        const handleKeyDown = (e) =>{
            if (!canMove.current) return;

            let changed = false;

            if(e.code === 'Space' || e.key === 'ArrowUp'){
                jumpTriggerRef.current = true;
            }
            if (e.key === 'ArrowLeft') {
                if (laneRef.current > 0) {
                    laneRef.current -= 1;
                    changed = true;
                }
            }else if (e.key === 'ArrowRight') {
                if (laneRef.current < 2) {
                    laneRef.current += 1;
                    changed = true;
                }
            }

            if(changed){
                canMove.current = false;

                setTimeout(()=>{
                    canMove.current = true;
                }, 100);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return ()=>{
            window.removeEventListener('keydown', handleKeyDown);
            return () => clearTimeout(timerId);
        };
    }, []);

    const [gameOver, setGameOver] = useState(false);

    if (gameOver && canDie) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999
            }}>
                <h1>OYUN BİTTİ!</h1>
                <button 
                    onClick={onRestart} 
                    style={{ padding: '20px', fontSize: '20px', cursor: 'pointer' }}
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }
    return(
        <div className="game-main-screen" style={{ height: "370px", width:'240px',
            background: "black", position: 'fixed', right: '0', transform:'translateY(0px)'
         }}>
            {showImage && (
                <img src={dialogBox}
                style={{
                    position: 'absolute', top: '0px', height: '200px', right: '90px', zIndex: 2000
                }}
                />)}
            <Canvas camera = {{position: [0, 3, 5], fov:60}}>
                <ambientLight intensity={1}/>
                <directionalLight position={[10, 10, 5]} intensity={1.5}/>

                <Environment
                    files="/city.exr"
                    background
                />

                <fog attach="fog" args={['#333', 10, 50]} />
                

                <Suspense fallback={null}>
                    <Player 
                        laneRef={laneRef} 
                        jumpTriggerRef={jumpTriggerRef}
                        playerPositionRef = {playerPositionRef}
                    />
                    <Ground /> 
                </Suspense>
                <Suspense fallback={null}>
                    <RivalManager 
                        laneRef={laneRef} 
                        setGameOver={setGameOver}
                        playerPositionRef = {playerPositionRef}
                    />
                </Suspense>
            </Canvas>
            </div>
        
    );
}