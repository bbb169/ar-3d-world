import { Dimensions, GestureResponderEvent } from 'react-native';
import { Matrix4, PerspectiveCamera, Spherical, Vector3 } from 'three';

const spherical = new Spherical(100, Math.PI * 3 / 4, Math.PI * 5 / 4);
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
      spherical.makeSafe();

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

  const cameraUnitVector = new Vector3(0, 0, -1).applyMatrix4(cameraMatrix).normalize();
  const newCameraLookAt = cameraLookAt.clone();

  if (frontBackDis) {
    // move some distance in this direction
    camera.position.addScaledVector(cameraUnitVector, frontBackDis);
  }

  if (leftRightDis) {
    // get left crosss vector on vector which camera is look at
    const cameraLeftRightUnitVector = new Vector3().crossVectors(new Vector3(0, 1, 0), cameraUnitVector);

    // we need move camera lookAt and position, this make user's perspective won't be changed
    newCameraLookAt.addScaledVector(cameraLeftRightUnitVector, leftRightDis);
    camera.position.addScaledVector(cameraLeftRightUnitVector, leftRightDis);
  }

  if (upDownDis) {
    camera.position.addScaledVector(new Vector3(0, 1, 0), upDownDis);
    newCameraLookAt.addScaledVector(new Vector3(0, 1, 0), upDownDis);
  }

  cameraLookAt.copy(newCameraLookAt);
  camera.lookAt(cameraLookAt);

  // make camera won't out range
  camera.position.set(Math.max(10, camera.position.x), Math.max(10, camera.position.y), Math.max(10, camera.position.z));
  camera.updateProjectionMatrix();
}

export {
  cameraLookAt,
  spherical as cameraSpherical,
};
