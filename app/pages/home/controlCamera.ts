import { Dimensions, GestureResponderEvent } from 'react-native';
import { Matrix4, PerspectiveCamera, Spherical, Vector3 } from 'three';

const spherical = new Spherical(100000, Math.PI * 3 / 4, Math.PI * 5 / 4);
const cameraLookAt = new Vector3().set(20, 20, 20).setFromSpherical(spherical);

export function getRotateCamera(camera: PerspectiveCamera) {
  let touchPosition: {
    x: number,
    y: number,
  } | null;
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
      // get diff from pre and current touch positions
      const deltaX = evt.nativeEvent.locationX - touchPosition.x;
      const deltaY = evt.nativeEvent.locationY - touchPosition.y;

      spherical.theta += Math.PI * deltaX / height;
      spherical.phi -= Math.PI * deltaY / height;

      // two PI is one circle, this won't change direction,just make theta won't be too large
      if (spherical.theta > Math.PI * 2) {
        spherical.theta -= Math.PI * 2;
      }

      // get a ball coordinate centered on the camera's position
      // and set its spherical, this will make rotate camera being smoothly.
      // if we just use vector.subVector to change vector which camera is look at
      // will be diffcult to move when vector is really large, spherical can avoid this
      cameraLookAt.copy(camera.position.clone().setFromSpherical(spherical));
      camera.lookAt(cameraLookAt);

      // update position
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

interface MoveCameraProps {
  camera: PerspectiveCamera,
  frontBackDis?: number,
  leftRightDis?: number,
  upDownDis?: number,
  changPosition?: boolean,
}

export default function moveCamera({
  camera,
  frontBackDis,
  leftRightDis,
  upDownDis,
}: MoveCameraProps) {
  const cameraMatrix = new Matrix4();
  cameraMatrix.copy(camera.matrixWorld);
  const sensity = 10;

  const cameraUnitVector = cameraLookAt.clone().negate().normalize();
  const newCameraLookAt = cameraLookAt.clone();

  if (frontBackDis) {
    // move some distance in this direction
    camera.position.addScaledVector(cameraUnitVector, frontBackDis * sensity);
  }

  if (leftRightDis) {
    // get left crosss vector on vector which camera is look at
    const cameraLeftRightUnitVector = new Vector3().crossVectors(new Vector3(0, 1, 0), cameraUnitVector);

    // we need move camera lookAt and position, this make user's perspective won't be changed
    newCameraLookAt.addScaledVector(cameraLeftRightUnitVector, leftRightDis * sensity);
    camera.position.addScaledVector(cameraLeftRightUnitVector, leftRightDis * sensity);
  }

  if (upDownDis) {
    camera.position.addScaledVector(new Vector3(0, 1, 0), upDownDis * sensity);
    newCameraLookAt.addScaledVector(new Vector3(0, 1, 0), upDownDis * sensity);
  }

  cameraLookAt.copy(newCameraLookAt);
  camera.lookAt(cameraLookAt);

  // make camera won't out range
  // camera.position.set(Math.max(10, camera.position.x), Math.max(10, camera.position.y), Math.max(10, camera.position.z));
  camera.updateProjectionMatrix();
}

export {
  cameraLookAt,
  spherical as cameraSpherical,
};
