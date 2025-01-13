import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export function Model({ animationName = 'idle', ...props }) {
  const { scene } = useGLTF('/models/animations/womantwo.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  const { animations: idleAnimation } = useFBX('/models/animations/woman/idle.fbx');
  idleAnimation[0].name = 'idle'; // Ensure naming consistency

  const { actions } = useAnimations([idleAnimation[0]], clone); // Pass the clone as root

  const groupRef = useRef(); // Reference for rotation
  const [size, setSize] = useState([0.01, 0.01, 0.01]); // Responsive size

  useEffect(() => {
    if (actions && actions[animationName]) {
      actions[animationName].reset().fadeIn(0.5).play();
      return () => actions[animationName].fadeOut(0.5);
    } else {
      console.warn(`Animation "${animationName}" not found.`);
    }
  }, [animationName, actions]);

  // Automatically rotate the model
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.05; // Adjust rotation speed here
    }
  });

  // Adjust size dynamically based on container
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setSize([0.007, 0.007, 0.007]); // Smaller for mobile
      } else {
        setSize([0.01, 0.01, 0.01]); // Default size for larger screens
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize); // Add listener

    return () => window.removeEventListener('resize', handleResize); // Clean up
  }, []);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={size}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh geometry={nodes.Ch46.geometry} material={materials.Ch46_body} skeleton={nodes.Ch46.skeleton} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/animations/womantwo.glb');
export default Model;
