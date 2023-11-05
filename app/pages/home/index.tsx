import React, { Suspense, useRef } from 'react';
import { View } from 'react-native';
import { Color, PerspectiveCamera } from 'three';
import { Canvas } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import XYZGrid from '../../component/XYZGrid';
import { homePageStyles } from './style';
import FixedControlCameraButtons from './component';
import Cube from '../../component/cube';

export default function HomePage(): React.JSX.Element {
  const [OrbitControls, events] = useControls();
  const cameraRef = useRef<PerspectiveCamera>(new PerspectiveCamera());
  const camera = cameraRef.current;

  return (
    <View style={homePageStyles.wholeView}>
      {/* float buttons to control zoom of 3d camera */}
      <FixedControlCameraButtons camera={camera} />
      {/* GLView to render 3d space */}
      <View style={homePageStyles.canvasView} {...events}>
        <Canvas scene={{ background: new Color('black') }} camera={camera}>
          <Suspense fallback={null}>
            <Cube position={[1, 1, 1]} />
            <XYZGrid isXYZ="isX" />
            <XYZGrid isXYZ="isY" />
            <XYZGrid isXYZ="isZ" />
          </Suspense>

          <OrbitControls />
        </Canvas>
      </View>
      {/* <EditScreenInfo path="app/pages/home/index.tsx" /> */}
    </View>
  );
}
