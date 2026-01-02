import React, {useEffect, useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';

export const Ground = React.memo(function Ground(){
    const baseUrl = import.meta.env.BASE_URL;
    const {gl} = useThree();

    const textures = useTexture({
        map: `${baseUrl}textures/Ground085_2K-JPG_Color.jpg`,
        normalMap : `${baseUrl}/textures/Ground085_2K-JPG_NormalGL.jpg`,
        roughnessMap: `${baseUrl}/textures/Ground085_2K-JPG_Roughness.jpg`
    });

    useEffect(()=>{
        const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

        Object.keys(textures).forEach((key)=>{
            textures[key].wrapS = textures[key].wrapT = THREE.RepeatWrapping;
            textures[key].repeat.set(2,20);
            textures[key].anisotropy = maxAnisotropy;
            textures[key].needsUpdate = true;
        });
    }, [textures, gl]);

    const line1Ref = useRef();
    const line2Ref = useRef();

    useFrame((state, delta)=>{
        
        const time = state.clock.elapsedTime;

        const GAME_SPEED = Math.min(20+(time*15), 100);
        
        Object.keys(textures).forEach((key) => {
                textures[key].offset.y += (GAME_SPEED) * delta * 0.05;  
        });

        if (line1Ref.current && line2Ref.current) {
            line1Ref.current.position.z += GAME_SPEED * delta;
            line2Ref.current.position.z += GAME_SPEED * delta;

            if (line1Ref.current.position.z > 10) {
                line1Ref.current.position.z = -90;
            }

            if (line2Ref.current.position.z > 10) {
                line2Ref.current.position.z = -90;
            }
        }


    });

    return(
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -40]}>
                <planeGeometry args={[10, 100, 100, 100]}/>
                <meshStandardMaterial {...textures} color='white'/>
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.01, -20]}>
                <planeGeometry args = {[0.1, 100]}/>
                <meshBasicMaterial color='white' opacity={0.5} transparent/>
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.01, -20]}>
                <planeGeometry args={[0.1, 100]}/>
                <meshBasicMaterial color='white' opacity={0.5} transparent/>
            </mesh>
        </group>
    )
})
