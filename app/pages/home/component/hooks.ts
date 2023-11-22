import { Matrix4, PerspectiveCamera, Vector3 } from 'three';

interface MoveCameraProps {
  camera: PerspectiveCamera,
  frontBackDis?: number,
  leftRightDis?: number,
  upDownDis?: number,
  changPosition?: boolean,
}

export default function getMoveCamera(): [Vector3, ({ frontBackDis, leftRightDis, upDownDis }: MoveCameraProps) => void] {
  const cameraLookAt = new Vector3(0, 0, 0);

  return [cameraLookAt, ({
    camera,
    frontBackDis,
    leftRightDis,
    upDownDis,
    changPosition = true,
  }: MoveCameraProps) => {
    const cameraMatrix = new Matrix4();
    cameraMatrix.copy(camera.matrixWorld);
    console.log('pos', changPosition);

    const cameraUnitVector = new Vector3(0, 0, -1).applyMatrix4(cameraMatrix).normalize();
    const newCameraLookAt = cameraLookAt.clone();

    if (frontBackDis) {
      // move some distance in this direction
      changPosition && camera.position.addScaledVector(cameraUnitVector, frontBackDis);
    }

    if (leftRightDis) {
      const cameraLeftRightUnitVector = new Vector3().crossVectors(new Vector3(0, 1, 0), cameraUnitVector);

      newCameraLookAt.addScaledVector(cameraLeftRightUnitVector, leftRightDis);
      changPosition && camera.position.addScaledVector(cameraLeftRightUnitVector, leftRightDis);
    }

    if (upDownDis) {
      changPosition && camera.position.addScaledVector(new Vector3(0, 1, 0), upDownDis);
      newCameraLookAt.addScaledVector(new Vector3(0, 1, 0), upDownDis);
    }

    cameraLookAt.copy(newCameraLookAt);
    camera.lookAt(newCameraLookAt);
    console.log(111, newCameraLookAt);

    // make camera won't out range
    changPosition && camera.position.set(Math.max(10, camera.position.x), Math.max(10, camera.position.y), Math.max(10, camera.position.z));
    camera.updateProjectionMatrix();
  }];
}

export const [cameraLookAt, moveCamera] = getMoveCamera();
