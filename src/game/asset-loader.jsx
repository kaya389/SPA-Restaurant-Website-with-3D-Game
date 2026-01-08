import { useGLTF} from '@react-three/drei';
import { useEffect } from 'react';
import { assetPool } from './asset-pool';

function PreloadAsset({source}){
    const {scene} = useGLTF(source);
    
    useEffect(()=>{
        if(!assetPool.pools[source]){
            assetPool.preparePool(source, scene);
        }
    }, [source, scene]);

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
            {rivals.map((r) => (
                <PreloadAsset 
                    key={r.id}
                    source={r.source}
                />
            ))}
        </>
    );
}