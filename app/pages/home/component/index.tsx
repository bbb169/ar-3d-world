import { View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { fixedButtonsStyles } from '../style';
import { Button } from '@rneui/base';
import { PerspectiveCamera } from 'three';

/* float buttons to control zoom of 3d camera */
export default function FixedControlCameraButtons({
  camera,
}: {
  camera: PerspectiveCamera;
}) {
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([10, 10, 10]);

  const cameraZoom = (add = true) => {
    setCameraPosition(cameraPosition.map(position =>
        Math.max(10, add ? position * 2 : position / 2),) as [number, number, number],);
  };

  // update new camera position and keep camera focus on position (0, 0, 0)
  useLayoutEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.position.set(...cameraPosition);
  }, [cameraPosition]);

  return (
    <>
      <View style={fixedButtonsStyles(2).style}>
        <Button
          onPress={() => {
            cameraZoom(true);
          }}
          title="-"
        />
      </View>
      <View style={fixedButtonsStyles(1).style}>
        <Button
          onPress={() => {
            cameraZoom(false);
          }}
          title="+"
        />
      </View>
    </>
  );
}
