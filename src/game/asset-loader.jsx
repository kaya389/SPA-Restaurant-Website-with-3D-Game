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
        if(Object.keys(assetPool.pools).length === rivals.length){
            onReady();
        }
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