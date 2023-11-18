import { Matrix4, PerspectiveCamera, Vector3 } from 'three';

export default function moveCamera(camera: PerspectiveCamera, {
  frontBackDis,
  leftRightDis,
  upDownDis,
}: {
  frontBackDis?: number,
  leftRightDis?: number,
  upDownDis?: number
}) {
  const cameraMatrix = new Matrix4();
  cameraMatrix.copy(camera.matrixWorld);


  const cameraUnitVector = new Vector3(0, 0, -1).applyMatrix4(cameraMatrix).normalize();

  if (frontBackDis) {
    // move some distance in this direction
    camera.position.addScaledVector(cameraUnitVector, frontBackDis);
  }

  if (leftRightDis) {
    const cameraLeftRightUnitVector = new Vector3().crossVectors(new Vector3(0, 1, 0), cameraUnitVector);

    camera.position.addScaledVector(cameraLeftRightUnitVector, leftRightDis);
  }

  if (upDownDis) {
    camera.position.addScaledVector(new Vector3(0, 1, 0), upDownDis);
  }

  // make camera won't out range
  camera.position.set(Math.max(10, camera.position.x), Math.max(10, camera.position.y), Math.max(10, camera.position.z));
}
