import * as THREE from "three";
import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PositionalAudio, OrbitControls, Html } from "@react-three/drei";

import { AudioAnalyser } from "three";

import "./styles.css";

function Analyzer({ sound, camera }) {
  const mesh = useRef();
  const mesh2 = useRef();
  const mesh3 = useRef();
  const mesh4 = useRef();
  const mesh5 = useRef();
  const mesh6 = useRef();
  const analyser = useRef();
  const zoomSpeed = 100;

  useEffect(() => {
    analyser.current = new THREE.AudioAnalyser(sound.current, 64);
  }, [sound]);


  useFrame(({ clock }) => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();

       //starts at 40s, 80s is high beat
      mesh3.current.scale.x = mesh3.current.scale.y = mesh3.current.scale.z = (data / 130) * 2;
      mesh2.current.scale.x =mesh2.current.scale.y =mesh2.current.scale.z =(data / 100) * 2;
      mesh.current.scale.x =mesh.current.scale.y =mesh.current.scale.z =(data / 100) * 3;
      mesh5.current.scale.x =mesh5.current.scale.y = mesh5.current.scale.z =(data / 150) * 2;
      mesh6.current.scale.x = mesh6.current.scale.y = mesh6.current.scale.z = (data / 60) * 2;


      //mesh rotations
      mesh.current.rotation.y = Math.sin(clock.elapsedTime * (data / 4000)) * 1;
      mesh2.current.rotation.x = Math.sin(clock.elapsedTime * (data / 500)) * 0.9;
      camera.current.position.z -= data / zoomSpeed;
      camera.current.lookAt(mesh3.current.position);
      camera.current.updateProjectionMatrix();
    }
  });

  return (
    <>
      <mesh ref={mesh}>
        <sphereBufferGeometry args={[0.6, 64, 64]} />
        <meshPhysicalMaterial color="blue" metalness={0.7} roughness={0.2} />

        <ambientLight color="blue" intensity={0.3} />
      </mesh>

      <mesh ref={mesh2} rotation={[-10, 0, 0]}>
        <torusBufferGeometry args={[17, 6, 30, 276]} />
        <meshPhysicalMaterial color="black" metalness={1} roughness={0.3} />
      </mesh>

      <mesh ref={mesh4} rotation={[0, 0, 0]}>
        <torusBufferGeometry args={[30, 7, 8, 276]} />
        <meshPhysicalMaterial color="black" metalness={4} roughness={0.08} />
        <pointLight color="red" intensity={1} position={[-2, 0]} />
      </mesh>

      <mesh ref={mesh3} rotation={[0, 0, 0]}>
        <torusBufferGeometry args={[190, 20, 8, 276]} />
        <meshPhysicalMaterial color="black" metalness={1} roughness={0.2} />
      </mesh>

      <mesh ref={mesh5} position={[90, 10, 10]} rotation={[0, 0, 0]}>
        <sphereBufferGeometry args={[0, 0, 8, 276]} />
        <meshPhysicalMaterial color="#ffc93c" metalness={10} roughness={0.01} />
        <spotLight
          color="blue"
          intensity={10}
          position={[0, 50, 0]}
          angle={Math.PI / 4}
          penumbra={1}
        />
        <pointLight color="purple" intensity={10} position={[0, -200, 0]} />
      </mesh>

      <mesh ref={mesh6} rotation={[0, 0, 0]}>
        <torusBufferGeometry args={[8, 7, 8, 276]} />
        <meshPhysicalMaterial color="black" metalness={1} roughness={0.2} />
        <pointLight
          color="blue"
          intensity={50}
          position={[0, 700, 200]}
          angle={10}
        />
        <pointLight
          color="purple"
          intensity={90}
          position={[0, -800, 200]}
          angle={-10}
        />
        <pointLight
          color="blue"
          intensity={0.2}
          position={[0, 0, 150]}
          angle={-80}
        />
      </mesh>
    </>
  );
}

function PlaySound({ url }) {
  const sound = useRef();
  const camera = useRef();

  useEffect(() => {
    // create a new Audio object to preload the audio file
    const audio = new Audio(url);
    audio.load();
  }, [url]);

  return (
    <Suspense
      fallback={
        <mesh>
          <octahedronBufferGeometry args={[0.5, 2]} />
          <meshBasicMaterial color="white" wireframe />
        </mesh>
      }
    >
      <perspectiveCamera ref={camera} position={[0, 0, 40]} />
      <PositionalAudio autoplay url={url} ref={sound} />
      <Analyzer sound={sound} camera={camera} />
    </Suspense>
  );
}

export default function App() {
  return (
    <Canvas>
      <PlaySound url="short.MP3" />
      <Html>
        <div class="main" style={{ position: "absolute" }}>
          <h1>Audio Visulizer</h1>
          <h2>Rocky theme (1997)</h2>
          <p>"Two people before me had turned down this job of writing a film score to a movie that didn't cost $1m. There was no money for anyone. I embraced the $25,000 package deal. I had to pay for everything involved with the music; the paper, the musicians, the studio costs, the tape and I got what was left. Established composers thought: 'I don't want to take that chance."</p>
        </div>
      </Html>
      <OrbitControls />
    </Canvas>
  );
}
