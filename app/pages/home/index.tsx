import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { Color, PerspectiveCamera, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber/native';
import XYZGrid from '../../component/XYZGrid';
import { homePageStyles } from './style';
import FixedControlCameraButtons from './component';
import Cube from '../../component/cube';
import { getRotateCamera } from './controlCamera';
import { MineCraftGround } from '../../component/mineCraftGround';

export default function HomePage(): React.JSX.Element {
  const cameraRef = useRef<PerspectiveCamera>(new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000));
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
        <Canvas scene={{ background: new Color(0xbfd1e5)  }} camera={camera} >
          <Cube position={[1, 1, 1]} />
          <XYZGrid isXYZ="isX" />
          <XYZGrid isXYZ="isY" />
          <XYZGrid isXYZ="isZ" />
          <MineCraftGround />
          <ambientLight color={0xeeeeee} intensity={3} />
          <directionalLight color={0xffffff} intensity={12} position={new Vector3(1, 1, 0.5).normalize()}/>
        </Canvas>
      </View>
    </View>
  );
}
