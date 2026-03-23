import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

const BrainModel = ({ highlightLobe }) => {
  const meshRef = useRef();

  // Highlight specific parts of the brain based on lobe localization
  const lobeColors = useMemo(() => {
    const colors = {
      Frontal: '#ef4444',     // Red
      Parietal: '#3b82f6',    // Blue
      Temporal: '#f59e0b',    // Amber
      Occipital: '#10b981',   // Emerald
      Central: '#8b5cf6',     // Violet
      Default: '#475569'      // Slate
    };
    return colors;
  }, []);

  const activeColor = lobeColors[highlightLobe] || lobeColors.Default;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Frontal Lobe Representation */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0.5]} scale={[1, 0.8, 1.2]}>
        <MeshDistortMaterial 
          color={highlightLobe === 'Frontal' ? activeColor : '#64748b'} 
          speed={2} 
          distort={0.3} 
          opacity={0.6} 
          transparent 
        />
      </Sphere>

      {/* Parietal/Temporal Lobe Representation */}
      <Sphere args={[1, 32, 32]} position={[0, 0, -0.5]} scale={[1, 0.8, 1.2]}>
        <MeshDistortMaterial 
          color={highlightLobe !== 'Frontal' && highlightLobe !== 'Default' ? activeColor : '#64748b'} 
          speed={1.5} 
          distort={0.2} 
          opacity={0.6} 
          transparent 
        />
      </Sphere>

      {/* Internal "Detected Zone" Glow */}
      {highlightLobe !== 'Default' && (
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
          <Sphere args={[0.3, 16, 16]} position={[0, 0.2, highlightLobe === 'Frontal' ? 0.6 : -0.4]}>
            <meshStandardMaterial 
              color={activeColor} 
              emissive={activeColor} 
              emissiveIntensity={10} 
            />
          </Sphere>
        </Float>
      )}

      {/* Anatomical Labels */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {highlightLobe} Lobe Localization
      </Text>
    </group>
  );
};

const Anatomy3DViewer = ({ highlightLobe = 'Default' }) => {
  return (
    <div className="anatomy-3d-container h-[300px] sm:h-[400px] md:h-[500px] w-full bg-[#0f172a] rounded-[24px] relative overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <BrainModel highlightLobe={highlightLobe} />
        </Float>

        {/* Grid Floor for "Tech" vibe */}
        <gridHelper args={[10, 10, '#1e293b', '#0f172a']} position={[0, -2, 0]} />
      </Canvas>
      
      <div className="anatomy-overlay absolute bottom-5 left-5 pointer-events-none">
        <div className="text-[#3b82f6] text-xs font-extrabold uppercase mb-1">Neural Localizer</div>
        <div className="text-white text-xl font-bold">{highlightLobe} Region</div>
      </div>
    </div>
  );
};

export default Anatomy3DViewer;
