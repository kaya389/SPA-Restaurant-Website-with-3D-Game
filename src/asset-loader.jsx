import {useFBX, useTexture} from '@react-three/drei';
import { useEffect } from 'react';
import { assetPool } from './asset-pool';

function PreloadAsset({source, texture}){
    const fbx = useFBX(source);
    const tex = useTexture(texture);
    
    useEffect(()=>{
        if(!assetPool.pools[source]){
            assetPool.preparePool(source, fbx, tex, 1);
        }
    }, [source, fbx, tex]);

    return null;
}
export function AssetLoader({rivals, onReady}){
    useEffect(() => {
        const timer = setTimeout(() => {
            onReady(); // Oyunu başlat
        }, 2000); // 2 saniye yükleme payı ver
        return () => clearTimeout(timer);
    }, [onReady]);

    return (
        <>
            {rivals.map((r, index) => (
                <PreloadAsset 
                    key={index} 
                    source={r.source} 
                    texture={r.texture} 
                />
            ))}
        </>
    );
}