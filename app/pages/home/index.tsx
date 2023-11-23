import React, { Suspense, useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Color, PerspectiveCamera, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber/native';
import XYZGrid from '../../component/XYZGrid';
import { homePageStyles } from './style';
import FixedControlCameraButtons from './component';
import Cube from '../../component/cube';
import { cameraLookAt, moveCamera } from './component/hooks';
import { getRotateCamera } from './rotateCamera';

export default function HomePage(): React.JSX.Element {
  const {height, width} = Dimensions.get('window');
  const cameraRef = useRef<PerspectiveCamera>(new PerspectiveCamera());
  const camera = cameraRef.current;
  const [rotateCameraEvents] = useState(getRotateCamera(camera));
  const touchPosition = useRef<{ x: number, y: number} | null>(null);
  // const cameraTarget = useRef <Vector3>(new Vector3());

  return (
    <View style={homePageStyles.wholeView}>
      {/* float buttons to control zoom of 3d camera */}
      <FixedControlCameraButtons camera={camera} />
      {/* GLView to render 3d space */}
      <View
      style={homePageStyles.canvasView}
      {...rotateCameraEvents}
      // onTouchMove={
      //   (evt) => {
      //     if (touchPosition.current ===  null) {
      //       touchPosition.current = {
      //         x: evt.nativeEvent.locationX,
      //         y: evt.nativeEvent.locationY,
      //       };
      //       return;
      //     }

      //     const touch = touchPosition.current;
      //     // const xDiff = evt.nativeEvent.locationX - x;
      //     // const yDiff = evt.nativeEvent.locationY - y;
      //     // moveCamera({
      //     //   leftRightDis: -xDiff / (2 * height),
      //     //   upDownDis: yDiff / (2 * width),
      //     //   camera,
      //     // });
      //     const deltaX = evt.nativeEvent.locationX - touch.x;
      //     const deltaY = evt.nativeEvent.locationY - touch.y;

      //     // Adjust these values to control the sensitivity of rotation
      //     const sensitivity = 0.5;
      //     cameraLookAt.x -= deltaX * sensitivity;
      //     cameraLookAt.y += deltaY * sensitivity;

      //     // Limit the rotation to avoid gimbal lock
      //     // cameraLookAt.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraLookAt.y));

      //     // Update the camera rotation
      //     // cameraLookAt.copy(cameraLookAt.normalize());
      //     camera.lookAt(cameraLookAt);
      //     console.log(cameraLookAt);

      //     // Store the current touch position for the next frame
      //     touchPosition.current = {
      //       x: evt.nativeEvent.locationX,
      //       y: evt.nativeEvent.locationY,
      //     };
      //   }
      // }
      // onTouchEnd={() => {
      //   touchPosition.current = null;
      // }}
      >
        <Canvas scene={{ background: new Color('black') }} camera={camera}>
          <Suspense fallback={null}>
            <Cube position={[1, 1, 1]} />
            <XYZGrid isXYZ="isX" />
            <XYZGrid isXYZ="isY" />
            <XYZGrid isXYZ="isZ" />
          </Suspense>
        </Canvas>
      </View>
    </View>
  );
}
