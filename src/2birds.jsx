import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

function SingleBird({ source, texturePath, scale, speed, offset }) {
    const meshRef = useRef();
    const fbx = useFBX(source);
    const texture = useTexture(texturePath);

    const clone = useMemo(() => {
        const c = SkeletonUtils.clone(fbx);
        c.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    map: texture,
                    color: new THREE.Color(1, 1, 1),
                });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return c;
    }, [fbx, texture]);

    useEffect(()=>{
        meshRef.current.position.x = offset.x;
        meshRef.current.position.y = 0;

    },[]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        

        const targetX = (state.pointer.x);
        const targetY = (state.pointer.y);

        
        const flapSpeed = 5; // Çırpma hızı
        const flapAmount = 0.1; // Çırpma açısı
        meshRef.current.rotation.z = Math.sin(time * flapSpeed) * flapAmount;
        meshRef.current.position.y += Math.sin(time * 2) * 0.002 * offset.y;

        meshRef.current.position.x += (targetX === 0)?
            (0):((targetX - meshRef.current.position.x*(-offset.x)) * speed)+(0.01 * offset.x);

        meshRef.current.position.y += (targetY === 0)?
            (0):(targetY - meshRef.current.position.y* offset.y) * speed;
        
        
        meshRef.current.rotation.y = state.pointer.x;
        meshRef.current.rotation.x = -state.pointer.y;
        
    });

    return (
        <primitive 
            ref={meshRef}
            object={clone} 
            scale={scale} 
            rotation={[0, 0, 0]} 
        />
    );
}

export function TwoBirds() {
    return (
        <Canvas 
            style={{ 
                position: 'fixed', top: 0, left: 0, 
                width: '100%', height: '100%', 
                pointerEvents: 'auto',
                zIndex: 2 
            }}
        >
            <ambientLight intensity={1.2} />
            <directionalLight intensity={1.2} position={[5, 10, 5]} />
            
            <Suspense fallback={null}>
                <SingleBird 
                    source="/cockatrice.fbx"
                    texturePath="/Material_BaseColor.png" 
                    scale={[0.01, 0.01, 0.01]} 
                    speed={0.005} 
                    offset={{ x: -1.4, y:  1.7}}
                />

                <SingleBird 
                    source="/bon-little.fbx" 
                    texturePath="/bon-little_texture.png" 
                    scale={[0.006, 0.006, 0.006]} 
                    speed={0.009}
                    offset={{ x: -0.6, y: 2}}
                />
            </Suspense>
        </Canvas>
    );
}