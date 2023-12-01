import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fixedButtonsStyles, homePageStyles } from '../style';
import { PerspectiveCamera } from 'three';
import { GestureHandlerRootView  } from 'react-native-gesture-handler';
import KorolJoystick from '../../../component/joystick';
import moveCamera, { cameraLookAt } from '../controlCamera';
import IconButton from '../../../component/iconButton';

/* float buttons to control zoom of 3d camera */
export default function FixedControlCameraButtons({
  camera,
}: {
  camera: PerspectiveCamera;
}) {
  const [startMove, setStartMove] = useState(0);
  const [frameAnimation, setFrameAnimation] = useState<any>(null);

  useEffect(() => {
    camera.position.set(20, 20, 20);
    camera.lookAt(cameraLookAt);
  }, []);

  useEffect(() => {
    const interval = frameAnimation;

    if (interval) {
      clearInterval(interval);
    }

    if (startMove) {
      setFrameAnimation(setInterval(() => {
        moveCamera({
          camera,
          upDownDis: startMove,
        });
      }, 16));
    }
  }, [startMove]);

  return (
    <>
      <View style={fixedButtonsStyles(2).style}>
        <IconButton
          buttonProps={{
            onPressIn: () => {
              setStartMove(-1);
            },
            onPressOut: () => {
              setStartMove(0);
            },
          }}
          iconProps= {{
            name: 'downcircleo',
            size: 36,
          }}
        />
      </View>
      <View style={fixedButtonsStyles(1).style}>
        <IconButton
          buttonProps={{
            onPressIn: () => {
              setStartMove(1);
            },
            onPressOut: () => {
              setStartMove(0);
            },
          }}
          iconProps= {{
            name: 'upcircleo',
            size: 36,
          }}
        />
      </View>
      <GestureHandlerRootView style={homePageStyles.bottomStick}>
        <KorolJoystick color="#06b6d4" radius={75} onMove={({ position }) => {
          const { x, y } = position;
          moveCamera({
            camera,
            frontBackDis: -y,
            leftRightDis: x,
          });
        }} />
      </GestureHandlerRootView>
    </>
  );
}
