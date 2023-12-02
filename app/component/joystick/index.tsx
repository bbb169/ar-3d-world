import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import * as utils from './utils';
import { Gesture, GestureDetector, GestureTouchEvent } from 'react-native-gesture-handler';
import { joystickStyles } from './style';

interface JoystickUpdateEvent {
  type: 'move' | 'stop' | 'start';
  position: {
    x: number;
    y: number;
  };
  force: number;
  angle: {
    radian: number;
    degree: number;
  };
}

interface Props {
  onStart?: (e: JoystickUpdateEvent) => void;
  onMove?: (e: any) => void;
  onStop?: (e: JoystickUpdateEvent) => void;
  radius?: number;
  color?: string;
}

const KorolJoystick: React.FC<Props> = (props) => {
  const { onStart, onMove, onStop, color = '#000000', radius = 150 } = props;

  const wrapperRadius = radius;
  const nippleRadius = wrapperRadius / 3;

  const [x, setX] = useState(wrapperRadius - nippleRadius);
  const [y, setY] = useState(wrapperRadius - nippleRadius);
  const moveIntervalRef = useRef<number>();

  const handleTouchMove = useMemo(() => {
    let timerLimit = false;

    const move = (event: GestureTouchEvent) => {
      if (timerLimit) {
        return;
      }

      if (!timerLimit) {
        timerLimit = true;
        setTimeout(() => {
          timerLimit = false;
        }, 0);
      }

      const e = event.changedTouches[0];
      const fingerX = e.x;
      const fingerY = e.y;
      let coordinates = {
        x: fingerX - nippleRadius,
        y: fingerY - nippleRadius,
      };

      const angle = utils.calcAngle(
        { x: fingerX, y: fingerY },
        { x: wrapperRadius, y: wrapperRadius }
      );

      let dist = utils.calcDistance(
        { x: wrapperRadius, y: wrapperRadius },
        { x: fingerX, y: fingerY }
      );

      const force = dist / (nippleRadius * 2);

      dist = Math.min(dist, wrapperRadius);
      if (dist === wrapperRadius) {
        coordinates = utils.findCoord(
          { x: wrapperRadius, y: wrapperRadius },
          dist,
          angle
        );
        coordinates = {
          x: coordinates.x - nippleRadius,
          y: coordinates.y - nippleRadius,
        };
      }
      setX(coordinates.x);
      setY(coordinates.y);

      const triggerMove = () => {
        onMove && onMove({
          position: {
            x: (coordinates.x - 50) / 75,
            y: (coordinates.y - 50) / 75,
          },
          angle: {
            radian: utils.degreesToRadians(angle),
            degree: angle,
          },
          force,
          type: 'move',
        });
      };

      triggerMove();

      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = setInterval(() => {
        triggerMove();
      }, 1) as unknown as number;
    };

    return move;
  }, []);

  const handleTouchEnd = () => {
    setX(wrapperRadius - nippleRadius);
    setY(wrapperRadius - nippleRadius);

    clearInterval(moveIntervalRef.current);
    onStop &&
      onStop({
        force: 0,
        position: {
          x: 0,
          y: 0,
        },
        angle: {
          radian: 0,
          degree: 0,
        },
        type: 'stop',
      });
  };

  const handleTouchStart = () => {
    onStart &&
      onStart({
        force: 0,
        position: {
          x: 0,
          y: 0,
        },
        angle: {
          radian: 0,
          degree: 0,
        },
        type: 'start',
      });
  };

  const panGesture = Gesture.Pan()
  .onTouchesMove(handleTouchMove)
  .onStart(handleTouchStart)
  .onEnd(handleTouchEnd);

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={[
          {
            width: 2 * radius,
            height: 2 * radius,
            borderRadius: radius,
            backgroundColor: `${color}55`,
          },
          {
            transform: [{ rotateX: '180deg' }],
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={joystickStyles(x, y, nippleRadius, color).centerButton}
        />
      </View>
    </GestureDetector>
  );
};

export default KorolJoystick;
