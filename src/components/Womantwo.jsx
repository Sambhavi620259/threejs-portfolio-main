import React, { useEffect, useMemo } from 'react';
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

  useEffect(() => {
    if (actions && actions[animationName]) {
      actions[animationName].reset().fadeIn(0.5).play();
      return () => actions[animationName].fadeOut(0.5);
    } else {
      console.warn(`Animation "${animationName}" not found.`);
    }
  }, [animationName, actions]);

  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh geometry={nodes.Ch46.geometry} material={materials.Ch46_body} skeleton={nodes.Ch46.skeleton} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/animations/womantwo.glb');
export default Model;
