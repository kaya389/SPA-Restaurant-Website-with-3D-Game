import React, {useEffect, useRef, Suspense, useState} from 'react';

import {Canvas} from '@react-three/fiber';
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

function GameContent({ setGameOver, setCanDie }) {
    const laneRef = useRef(1);
    const jumpTriggerRef = useRef(false);
    const canMove = useRef(true);
    const playerPositionRef = useRef(new THREE.Vector3());

    useEffect(() => {
        const deathTimer = setTimeout(() => {
            setCanDie(true);
        }, 15000);

        const handleKeyDown = (e) => {
            if (!canMove.current) return;
            let changed = false;

            if (e.code === 'Space' || e.key === 'ArrowUp') {
                jumpTriggerRef.current = true;
            }
            if (e.key === 'ArrowLeft' && laneRef.current > 0) {
                laneRef.current -= 1; changed = true;
            } else if (e.key === 'ArrowRight' && laneRef.current < 2) {
                laneRef.current += 1; changed = true;
            }

            if (changed) {
                canMove.current = false;
                setTimeout(() => { canMove.current = true; }, 100);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(deathTimer);
        };
    }, [setCanDie]);
    
    return (
        <>
            <Player 
                laneRef={laneRef} 
                jumpTriggerRef={jumpTriggerRef}
                playerPositionRef={playerPositionRef}
            />
            <Ground />
            <RivalManager 
                laneRef={laneRef} 
                setGameOver={setGameOver} 
                playerPositionRef={playerPositionRef}
            />
        </>
    );
}

function RivalManager( {laneRef, setGameOver, playerPositionRef}){

    const[i, setI] = useState(0);
    const[poolReady, setPoolReady] = useState(false);
    const[smallerThen20, setSmallerThen20] = useState(false);
    const[biggerThen20, setBiggerThen20] = useState(false);

    useEffect(()=>{        
        if(i > 20){
            return;
        }

        const intervalId = setInterval(()=>{
            setI(prevI => {
                const nextI = prevI + 1;
                if(nextI === 20){
                    setBiggerThen20(true);
                    setSmallerThen20(true);
                    clearInterval(intervalId);
                }
                else{
                    setSmallerThen20(true);
                }
                return nextI;
            });
        }, 2000);

        return () => clearInterval(intervalId);

    }, []);

    return(
        <>
        <AssetLoader
            rivals={rivals}
            onReady={()=> setPoolReady(true)}
        />
        {
            poolReady && smallerThen20 && (
                <AssetElement
                    key = {biggerThen20 ? `loop` : rivals[i].id}
                    data={rivals[i]}
                    laneRef={laneRef}
                    setGameOver = {setGameOver}
                    playerPositionRef = {playerPositionRef}
                    biggerThen20 = {biggerThen20}
                />
            )
        }
        </>
    );
}

export function Game(){
    const [showImage, setShowImage] = useState(true);
    
    const [canDie, setCanDie] = useState(false);

    const [restartKey, setRestartKey] = useState(0);

    const [gameOver, setGameOver] = useState(false);

    const handleRestart = ()=>{
        setGameOver(false);
        setCanDie(false);
        setShowImage(false);
        setRestartKey(prev => prev + 1);
    }

    useEffect(() => {
        const timer = setTimeout(() => setShowImage(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    

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
        {gameOver && canDie && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999
            }}>
                <h1>OYUN BİTTİ!</h1>
                <button 
                    onClick={handleRestart} 
                    style={{ padding: '20px', fontSize: '20px', cursor: 'pointer' }}
                >
                    Tekrar Dene
                </button>
            </div>
        )}
            <Canvas camera = {{position: [0, 3, 5], fov:60}}>
                <ambientLight intensity={1}/>
                <directionalLight position={[10, 10, 5]} intensity={1.5}/>

                <Environment
                    files="/city.exr"
                    background
                />

                <fog attach="fog" args={['#333', 10, 50]} />
                

                <Suspense fallback={null}>
                    <GameContent
                        key={restartKey}
                        setGameOver={setGameOver}
                        setCanDie={setCanDie}
                    />
                </Suspense>
            </Canvas>
            </div>
        
    );
}