import React, { Suspense, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import { Color, PerspectiveCamera } from 'three';
import { Canvas } from '@react-three/fiber/native';
import XYZGrid from '../../component/XYZGrid';
import { homePageStyles } from './style';
import FixedControlCameraButtons from './component';
import Cube from '../../component/cube';

export default function HomePage(): React.JSX.Element {
  const {height, width} = Dimensions.get('window');
  const cameraRef = useRef<PerspectiveCamera>(new PerspectiveCamera());
  const camera = cameraRef.current;
  const touchPosition = useRef<{ x: number, y: number} | null>(null);

  return (
    <View style={homePageStyles.wholeView}>
      {/* float buttons to control zoom of 3d camera */}
      <FixedControlCameraButtons camera={camera} />
      {/* GLView to render 3d space */}
      <View style={homePageStyles.canvasView} onTouchMove={
        (evt) => {
          if (touchPosition.current ===  null) {
            touchPosition.current = {
              x: evt.nativeEvent.pageX,
              y: evt.nativeEvent.pageY,
            };
            return;
          }

          const { x, y } = touchPosition.current;
          const xDiff = evt.nativeEvent.pageX - x;
          const yDiff = evt.nativeEvent.pageY - y;
          camera.rotateY(xDiff / (2 * height));
          camera.rotateX(yDiff / (2 * width));
        }
      } onTouchEnd={() => {
        touchPosition.current = null;
      }}>
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
