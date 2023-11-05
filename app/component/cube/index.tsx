import { MeshProps } from '@react-three/fiber/native';
import React, { useRef } from 'react';
import { BoxGeometry } from 'three';

function BoxEdges({ boxRef }: { boxRef: React.RefObject<BoxGeometry> }) {
  return (
    <lineSegments>
      <edgesGeometry args={[boxRef.current]} />
      <lineBasicMaterial args={[{ color: 'red', linewidth: 2 }]} />
    </lineSegments>
  );
}

export default function Cube({ ...props }: MeshProps) {
  const boxRef = useRef<BoxGeometry>(null);

  return (
    <mesh {...props}>
      <boxGeometry ref={boxRef} args={[1, 1, 1]} />
      <meshBasicMaterial attach="material" color="yellow" />
      {boxRef.current && <BoxEdges boxRef={boxRef} />}
    </mesh>
  );
}
