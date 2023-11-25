import React, { Suspense, useRef, useState } from 'react';
import { View } from 'react-native';
import { Color, PerspectiveCamera } from 'three';
import { Canvas } from '@react-three/fiber/native';
import XYZGrid from '../../component/XYZGrid';
import { homePageStyles } from './style';
import FixedControlCameraButtons from './component';
import Cube from '../../component/cube';
import { getRotateCamera } from './controlCamera';

export default function HomePage(): React.JSX.Element {
  const cameraRef = useRef<PerspectiveCamera>(new PerspectiveCamera());
  const camera = cameraRef.current;
  const [rotateCameraEvents] = useState(getRotateCamera(camera));

  return (
    <View style={homePageStyles.wholeView}>
      {/* float buttons to control zoom of 3d camera */}
      <FixedControlCameraButtons camera={camera} />
      {/* GLView to render 3d space */}
      <View
        style={homePageStyles.canvasView}
        {...rotateCameraEvents}
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
