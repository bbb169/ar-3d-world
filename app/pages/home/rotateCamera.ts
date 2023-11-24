import { Dimensions, GestureResponderEvent } from 'react-native';
import { PerspectiveCamera, Spherical } from 'three';
import { cameraLookAt } from './component/hooks';

export function getRotateCamera(camera: PerspectiveCamera) {
  let touchPosition: {
    x: number,
    y: number,
  } | null;
  const cameraSpherical = new Spherical(100, -Math.PI / 2, Math.PI / 2);
  const { height } = Dimensions.get('window');

  return {
    onTouchMove(evt: GestureResponderEvent) {
      if (!touchPosition) {
        touchPosition = {
          x: evt.nativeEvent.locationX,
          y: evt.nativeEvent.locationY,
        };
        return;
      }
      const spherical = cameraSpherical;
      const deltaX = evt.nativeEvent.locationX - touchPosition.x;
      const deltaY = evt.nativeEvent.locationY - touchPosition.y;

      // const sensitivity = 0.002;
      spherical.theta += Math.PI * deltaX / height;
      spherical.phi -= Math.PI * deltaY / height;

      spherical.makeSafe();
      console.log(spherical.theta, spherical.phi);

      cameraLookAt.copy(camera.position.clone().setFromSpherical(spherical));
      camera.lookAt(cameraLookAt);

      touchPosition = {
        x: evt.nativeEvent.locationX,
        y: evt.nativeEvent.locationY,
      };
    },
    onTouchEnd() {
      touchPosition = null;
    },
  };
}
