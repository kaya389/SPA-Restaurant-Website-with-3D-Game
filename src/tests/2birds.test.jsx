import { describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import {SingleBird} from '../2birds';

const mockMesh = {
    position: { x: 0, y: 0, z: 0, set: vi.fn() },
    rotation: { x: 0, y: 0, z: 0 },
};

let frameCallbacks = [];

vi.mock('react', async()=>{
    const actual = await vi.importActual('react');

    return {
        ...actual,
        default: actual,
        useRef: (initialValue)=>{
            if(initialValue === undefined){
                return{
                    get current(){
                        return mockMesh;
                    },
                    set current(value){

                    }
                };
            }
            return {current: initialValue};
        },
    };
});

vi.mock('@react-three/fiber', ()=>({
    Canvas: ({children}) => <div>{children}</div>,
    useFrame: (callback)=>{
        frameCallbacks.push(callback);
    },
    useThree: ()=>({
        viewport: {getCurrentViewport: ()=>({width:10, height: 10})}
    })
}));

vi.mock('@react-three/drei', ()=>({
    useGLTF: ()=>({scene: {}}),
    Environment: ()=>null,
}));

vi.mock('three-stdlib', ()=>({
    SkeletonUtils: {
        clone: ()=>mockMesh,
    }
}));

describe('birds movement by mouse attraction', ()=>{
    const originalError = console.error;
    beforeEach(()=>{
        console.error = vi.fn();
        frameCallbacks = [];
        mockMesh.rotation.y = 0;
    });
    afterEach(()=>{
        console.error = originalError;
    })
    it('birds must change their orientation by mouse position', async ()=>{
        window.innerHeight = 1000;
        window.innerWidth = 1000;

        render(<SingleBird
            source = 'test.glb'
            scale = {[1,1,1]}
            speed = {0.005}
            offset = {{x: -1.4, y: 1.7}}
        />);

        fireEvent.mouseMove(window, {clientX: 1000, clientY: 500});

        const mockState = {pointer: {x: 1, y: 0}, clock: {getElapsedTime: ()=>1}};

        frameCallbacks.forEach((cb)=>cb(mockState, 0.1));

        expect(mockMesh.rotation.y).toBeGreaterThan(0);

        mockState.pointer.x = -1;
        fireEvent.mouseMove(window, {clientX: 0, clientY: 500});

        frameCallbacks.forEach((cb) => cb(mockState, 0.1));
        frameCallbacks.forEach((cb) => cb(mockState, 0.1));

        expect(mockMesh.rotation.y).toBeLessThan(1);
    });
});