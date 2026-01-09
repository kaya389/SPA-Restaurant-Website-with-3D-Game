import { describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {TwoBirds} from '../2birds';
import { Environment, useGLTF } from '@react-three/drei';

const mockMesh = {
    position: { x: 0, y: 0, z: 0, set: vi.fn() },
    rotation: { x: 0, y: 0, z: 0 },
};

let frameCallbacks = [];

vi.mock('@react-three/fiber', ()=>({
    Canvas: ({children}) => <div>{children}</div>,
    useFrame: (callback)=>{
        frameCallbacks.push(callback);
    },
    useThree: ()=>({
        camera: {position: {z: 5}},
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
    beforeEach(()=>{
        frameCallbacks = [];
        mockMesh.rotation.x = 0;
        mockMesh.rotation.y = 0;
        mockMesh.position.x = 0;
    });
    it('birds must change their orientation by mouse position', async ()=>{
        window.innerHeight = 1000;
        window.innerWidth = 1000;

        render(<TwoBirds/>);

        fireEvent.mouseMove(window, {clientX: 1000, clientY: 500});

        const mockState = {clock: {getElapsedTime: ()=>1}};
        const mockDelta = 0.1;

        frameCallbacks.forEach((cb)=>cb(mockState, mockDelta));

        expect(mockMesh.rotation.y).toBeGreaterThan(0);

        fireEvent.mouseMove(window, {clientX: 0, clientY: 500});

        frameCallbacks.forEach((cb) => cb(mockState, mockDelta));
        frameCallbacks.forEach((cb) => cb(mockState, mockDelta));

        expect(mockMesh.rotation.y).toBeLessThan(1);
    });
});