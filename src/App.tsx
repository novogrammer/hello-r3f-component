import { Canvas } from '@react-three/fiber';
import './App.css'
import { Float, PerspectiveCamera, StatsGl } from '@react-three/drei';
import { Suspense } from 'react';
import { BlobMaterial } from './BlobMaterial';
import * as THREE from "three";

function GlobalScene(){
  return  <>
    <color attach="background" args={["green"]}/>
    <PerspectiveCamera makeDefault position={[0,0,5]} fov={30} />
    <ambientLight intensity={0.6} />
    <directionalLight intensity={1.0} position={[1, 1, 1]}/>
    <Suspense fallback={null}>
      <Float rotationIntensity={1}>
      <mesh>
          <boxGeometry/>
          <BlobMaterial color={new THREE.Color(0xff00ff)}/>
          {/* <meshStandardMaterial color="orange"/> */}
        </mesh>
        <mesh position={[0,0,-1]}>
          <boxGeometry args={[1,1,1]}/>
          <meshStandardMaterial color="white"/>
        </mesh>
        <mesh position={[0,-1,0]} >
          <boxGeometry args={[1,1,1]}/>
          <meshStandardMaterial color="white"/>
        </mesh>
        <mesh position={[-1,0,0]} >
          <boxGeometry args={[1,1,1]}/>
          <meshStandardMaterial color="white"/>
        </mesh>
      </Float>
    </Suspense>
  </>;
}

function App() {

  return (
    <>
      <div style={{
        position:"fixed",
        left:0,
        top:0,
        width:"100%",
        height:"100%",
      }}>
        <Canvas>
          <StatsGl/>
          <GlobalScene/>
        </Canvas>
      </div>
    </>
  )
}

export default App
