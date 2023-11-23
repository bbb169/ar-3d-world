import { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { OrthographicCamera, PerspectiveCamera, Spherical, Vector2, Vector3 } from 'three';

export function getRotateCamera(camera: PerspectiveCamera) {
  let height = 0;
  const EPSILON = 0.000001;
  const STATE = {
    NONE: 0,
    ROTATE: 1,
    DOLLY: 2,
  };
  const scope = {
    camera,

    enabled: true,

    target: new Vector3(),

    minZoom: 0,
    maxZoom: Infinity,

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to PI radians.
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,

    // How far you can orbit horizontally, upper and lower limits.
    // If set, the interval [min, max] must be a sub-interval of
    // [-2 PI, 2 PI], with (max - min < 2 PI)
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,

    // inertia
    dampingFactor: 0.05,

    enableZoom: true,
    zoomSpeed: 1.0,

    enableRotate: true,
    rotateSpeed: 1.0,

    enablePan: true,
    panSpeed: 1.0,
  };
  const internals = {
    rotateDelta: new Vector2(),
    rotateEnd: new Vector2(),
    rotateStart : new Vector2(),
    sphericalDelta : new Spherical(),
    spherical :  new Spherical(),
    scale: 1,
    state: STATE.NONE,
  };

  const start = (event: GestureResponderEvent) => {
    if (event.nativeEvent.touches.length === 1) {
      internals.rotateStart.set(
        event.nativeEvent.touches[0].locationX,
        event.nativeEvent.touches[0].locationY
      );
    }
  };
  const move = (event: GestureResponderEvent) => {
    if (event.nativeEvent.touches.length === 1) {
      internals.rotateEnd.set(
        event.nativeEvent.locationX,
        event.nativeEvent.locationY
      );
    } else {
      return;
    }
    console.log('got here');

    internals.rotateDelta
      .subVectors(internals.rotateEnd, internals.rotateStart).multiplyScalar(scope.rotateSpeed);

    // yes, height
    internals.sphericalDelta.theta -= ((2 * Math.PI * internals.rotateDelta.x) / height);
    internals.sphericalDelta.phi -= ((2 * Math.PI * internals.rotateDelta.y) / height);

    internals.rotateStart.copy(internals.rotateEnd);

    // =================== move camera ============================
    internals.spherical.theta +=
      internals.sphericalDelta.theta * scope.dampingFactor;
    internals.spherical.phi +=
      internals.sphericalDelta.phi * scope.dampingFactor;

    // restrict theta to be between desired limits
    const twoPI = 2 * Math.PI;
    let min = scope.minAzimuthAngle;
    let max = scope.maxAzimuthAngle;

    if (true) {
      if (min < -Math.PI) {
        min += twoPI;
      } else if (min > Math.PI) {
        min -= twoPI;
      }

      if (max < -Math.PI) {
        max += twoPI;
      } else if (max > Math.PI) {
        max -= twoPI;
      }

      if (min <= max) {
        internals.spherical.theta = Math.max(
          min,
          Math.min(max, internals.spherical.theta)
        );
      } else {
        internals.spherical.theta =
          internals.spherical.theta > (min + max) / 2
            ? Math.max(min, internals.spherical.theta)
            : Math.min(max, internals.spherical.theta);
      }

      // restrict phi to be between desired limits
      internals.spherical.phi = Math.max(
        scope.minPolarAngle + EPSILON,
        Math.min(scope.maxPolarAngle - EPSILON, internals.spherical.phi)
      );

      if ((scope.camera as PerspectiveCamera).isPerspectiveCamera) {
        internals.spherical.radius *= internals.scale;
      }
      console.log('here');

      scope.target.addScaledVector(new Vector3(), scope.dampingFactor);
      camera.lookAt(scope.target);
    }
  };

  return {
    onTouchStart(event: GestureResponderEvent) {
      console.log('021323');

      start(event);
    },

    onTouchMove(event: GestureResponderEvent) {
      console.log('11111123');

      move(event);
    },
    onLayout(event: LayoutChangeEvent) {
      height = event.nativeEvent.layout.height;
    },
  };
}
