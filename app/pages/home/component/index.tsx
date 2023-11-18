import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fixedButtonsStyles, homePageStyles } from '../style';
import { Button } from '@rneui/base';
import { PerspectiveCamera } from 'three';
import { GestureHandlerRootView  } from 'react-native-gesture-handler';
import KorolJoystick from '../../../component/joystick';
import moveCamera from '../../../utils/camera';

/* float buttons to control zoom of 3d camera */
export default function FixedControlCameraButtons({
  camera,
}: {
  camera: PerspectiveCamera;
}) {
  const [startMove, setStartMove] = useState(0);
  const [frameAnimation, setFrameAnimation] = useState<any>(null);

  useEffect(() => {
    const interval = frameAnimation;

    if (interval) {
      clearInterval(interval);
    }

    if (startMove) {
      setFrameAnimation(setInterval(() => {
        moveCamera(camera, {
          upDownDis: startMove,
        });
      }, 16));
    }
  }, [startMove]);

  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.position.set(20, 20, 20);
  }, []);

  return (
    <>
      <View style={fixedButtonsStyles(2).style}>
        <Button
          onPressIn={() => {
            setStartMove(-1);
          }}
          onPressOut={() => {
            setStartMove(0);
          }}
          title="-"
        />
      </View>
      <View style={fixedButtonsStyles(1).style}>
        <Button
          onPressIn={() => {
            setStartMove(1);
          }}
          onPressOut={() => {
            setStartMove(0);
          }}
          title="+"
        />
      </View>
      <GestureHandlerRootView style={homePageStyles.bottomStick}>
        <KorolJoystick color="#06b6d4" radius={75} onMove={({ position }) => {
          const { x, y } = position;
          moveCamera(camera, {
            frontBackDis: -y,
            leftRightDis: x,
          });
        }} />
      </GestureHandlerRootView>
    </>
  );
}
