import {Canvas} from '@react-three/fiber';
import {
  Float,
  PerspectiveCamera,
  StatsGl,
  useVideoTexture,
} from '@react-three/drei';
import {Suspense} from 'react';
import * as THREE from 'three';
import {BlobMaterial} from './BlobMaterial.tsx';
import {MeshTransparentVideoMaterial as MeshTransparentVideoMaterialImpl} from './MeshTransparentVideoMaterial.ts';
import {MeshTransparentVideoMaterial} from './MeshTransparentVideoMaterial.tsx';
import './App.css';

function GlobalScene() {
  const videoTexture = useVideoTexture('./bangkok_h264_alpha_1M.mp4');
  const meshTransparentVideoMaterial = new MeshTransparentVideoMaterialImpl({
    map: videoTexture,
  });
  return (
    <>
      <color attach='background' args={['green']}/>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={30}/>
      <ambientLight intensity={0.6}/>
      <directionalLight intensity={1} position={[1, 1, 1]}/>
      <Suspense fallback={null}>
        <Float rotationIntensity={5}>
          <mesh>
            <boxGeometry/>
            <BlobMaterial color={new THREE.Color(0xFF_00_FF)}/>
            {/* <meshStandardMaterial color="orange"/> */}
          </mesh>
          <mesh position={[0, 0, -1]}>
            <planeGeometry args={[2, 2]}/>
            <meshStandardMaterial color='white'/>
          </mesh>
          <mesh position={[-1, 0, 0]}>
            <planeGeometry args={[1, (1 / 16) * 9 * 2]}/>
            <meshBasicMaterial map={videoTexture}/>
          </mesh>
          <mesh position={[0, 1, 0]} material={meshTransparentVideoMaterial}>
            <planeGeometry args={[1, (1 / 16) * 9]}/>
          </mesh>
          <mesh position={[0, -1, 0]}>
            <planeGeometry args={[1, (1 / 16) * 9]}/>
            <MeshTransparentVideoMaterial map={videoTexture}/>
          </mesh>
        </Float>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <Canvas>
        <StatsGl/>
        <GlobalScene/>
      </Canvas>
    </div>
  );
}

export default App;
