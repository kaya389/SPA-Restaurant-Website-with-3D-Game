import {useRef, useEffect} from 'react';
import {useFBX, useTexture} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export function Player({laneRef, jumpTriggerRef, playerPositionRef}){
    const baseUrl = import.meta.env.BASE_URL;
    const meshRef = useRef();

    const fbx = useFBX(`${baseUrl}cockatrice.fbx`);
    const texture = useTexture(`${baseUrl}Material_BaseColor.png`);

    const SMOOTHNESS = 8;

    const GROUND_LEVEL = 0.5;

    const BASE_SCALE_X = 0.018;
    const BASE_SCALE_Y = 0.010;
    const BASE_SCALE_Z = 0.018;

    const isAirborne = useRef(false);
    const yVelocity = useRef(0);

    const JUMP_FORCE = 0.06;
    const GRAVITY = 0.001;

    //const targetX = (lane-1)*2;
    useFrame((state, delta)=>{
        if(meshRef.current){
            const time = state.clock.elapsedTime;

            let gamePresentationRotation = 0;
            let gamePresentationRotationX = 0;
            let gamePresentationPosition = 0;
            let targetMultiplier = 1;

            if(time < 10){
                gamePresentationRotation = Math.PI;
                gamePresentationPosition = 4;
                gamePresentationRotationX = -0.4
                setTimeout(()=>{
                    jumpTriggerRef.current = true;
                    isAirborne.current = false;
                }, 1000);
                jumpTriggerRef.current = false;
                isAirborne.current = true;
                targetMultiplier = 2;
            }

            meshRef.current.rotation.y = THREE.MathUtils.lerp(
                meshRef.current.rotation.y,
                gamePresentationRotation,
                2 * delta // Dönüş hızı
            );
            meshRef.current.rotation.x = THREE.MathUtils.lerp(
                meshRef.current.rotation.x,
                gamePresentationRotationX,
                2 * delta // Dönüş hızı
            );

            meshRef.current.position.z = THREE.MathUtils.lerp(
                meshRef.current.position.z,
                gamePresentationPosition,
                2 * delta // Dönüş hızı
            );

            meshRef.current.scale.x = THREE.MathUtils.lerp(
                meshRef.current.scale.x,
                BASE_SCALE_X * targetMultiplier,
                2 * delta // Büyüme hızı
            );
            meshRef.current.scale.y = THREE.MathUtils.lerp(
                meshRef.current.scale.y,
                BASE_SCALE_Y * targetMultiplier,
                2 * delta
            );
            meshRef.current.scale.z = THREE.MathUtils.lerp(
                meshRef.current.scale.z,
                BASE_SCALE_Z * targetMultiplier,
                2 * delta
            );


            //const smoothness = 5;

            if (jumpTriggerRef.current && !isAirborne.current) {
                isAirborne.current = true;
                yVelocity.current = JUMP_FORCE; // Yukarı hız ver
                jumpTriggerRef.current = false; // Emri sıfırla
            }

            if (isAirborne.current) {
                    yVelocity.current -= GRAVITY; // Hızı sürekli azalt (aşağı çek)
                    meshRef.current.position.y += yVelocity.current; // Pozisyonu güncelle

                    // --- KANAT ÇIRPMA EFEKTİ (Prosedürel Titreme) ---
                    // Havadayken Z ekseninde hızlıca titretelim
                    const flapSpeed = 15; // Çırpma hızı
                    const flapAmount = 0.4; // Çırpma açısı
                    meshRef.current.rotation.z = Math.sin(time * flapSpeed) * flapAmount;

                    // C) Yere İniş Kontrolü
                    if (meshRef.current.position.y <= GROUND_LEVEL) {
                        meshRef.current.position.y = GROUND_LEVEL; // Yere sabitle
                        isAirborne.current = false; // Artık yerdeyiz
                        yVelocity.current = 0; // Hızı sıfırla
                        // Kanat çırpma açısını düzelt (Hafif yamuk kalmasın)
                        meshRef.current.rotation.z = 0; 
                    }

            } else {
                // --- 2. YERDEYKEN KOŞMA EFEKTİ ---
                // Eğer havadaysak bu çalışmayacak
                meshRef.current.position.y = Math.sin(time * 20) * 0.03 + GROUND_LEVEL;

                // Koşarkenki sağa sola yatma efekti (Eski kodun)
                const targetX = (laneRef.current - 1) * 2;
                const tilt = (meshRef.current.position.x - targetX) * -0.5;
                meshRef.current.rotation.z = THREE.MathUtils.damp(
                    meshRef.current.rotation.z,
                    tilt,
                    SMOOTHNESS,
                    delta
                );
            }

            // --- 3. YATAY HAREKET (Her zaman çalışır) ---
            const targetX = (laneRef.current - 1) * 2;
            meshRef.current.position.x = THREE.MathUtils.damp(
                meshRef.current.position.x,
                targetX,
                SMOOTHNESS,
                delta
            );
            if(playerPositionRef){
                playerPositionRef.current.copy(meshRef.current.position);
            }
        }
    });

    useEffect(() => {
        fbx.traverse((child) => {
        if (child.isMesh) {
            // Modele "Senin rengin bu resimdir" diyoruz
            child.material.map = texture;
            
            // Renkler soluk çıkmasın diye
            child.material.color = new THREE.Color(1, 1, 1); 
            
            // Gölge ayarları
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Güncellemeyi onayla
            child.material.needsUpdate = true;
        }
        });
    }, [fbx, texture]);

    return(
        <mesh ref={meshRef} position={[0, 1, 0]}>
            <primitive
                object={fbx}
                rotation={[0, Math.PI, 0]}
                position-y={1}
                position-z = {0}
            />
        </mesh>
    );
}
