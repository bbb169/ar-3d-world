import React from 'react';

export type XYZGridProps = 'isX' | 'isY' | 'isZ';

export default function XYZGrid({ isXYZ }: { isXYZ: XYZGridProps }) {
  const gridSize = 100;

  // rotation ground grids to be a wall
  const getRotation = (isSelf = false) => {
    return isSelf ? Math.PI / 2 : 0;
  };

  // we only use positive axis, so we need to offset grids.
  const getPostion = (): [number, number, number] => {
    switch (isXYZ) {
      case 'isX':
        return [gridSize / 2, gridSize / 2, 0];
      case 'isY':
        return [gridSize / 2, 0, gridSize / 2];
      case 'isZ':
        return [0, gridSize / 2, gridSize / 2];
    }
  };

  return (
    <gridHelper
      rotation={[getRotation(isXYZ === 'isX'), 0, getRotation(isXYZ === 'isZ')]}
      position={getPostion()}
      args={[gridSize, gridSize, undefined, 'green']}
    />
  );
}
