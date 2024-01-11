import React, { ReactNode, useMemo, useState } from 'react';
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import { Direction } from '../../../constants/type';
import { emitSocket } from '../../utils/socket';
import { Dimensions } from 'react-native';

// 计算射线角度的函数
function calculateAngle(x: number, y: number) {
  // 使用 Math.atan2 计算弧度值
  const radians = Math.atan2(y, x);

  // 将弧度值转换为角度
  const degrees = radians * (180 / Math.PI);

  // 返回角度值
  return degrees;
}

function calculateDirection(angle: number): Direction {
    console.log(angle);

    if ((angle <= 45 && angle >= 0) || (angle > -45 && angle <= 0)) {
        return 'top';
    } else if (angle > 45 && angle <= 135) {
        return 'right';
    } else if (angle < -135 || angle > 135) {
        return 'bottom';
    } else if (angle < -45 && angle > -135) {
        return 'left';
    }
    console.log(angle, 'something goes wrong');
    return 'left';
}

export function GesturesHandler({ children, sensitivity = 1, setIsCloseGestureHandler, isDraging, setIsDraging }: {
    children: ReactNode,
    setIsCloseGestureHandler: (value: boolean) => void,
    isDraging: boolean,
    setIsDraging: (value: boolean) => void,
    /** 控制鼠标灵敏度 */
    sensitivity?: number,
}) {
    const [positionDiff, setPositionDiff] = useState<{
      /** total moved distance in X axis */
      totalX: number;
      /** total moved distance in Y axis */
      totalY: number;
      /** last position */
      X: number;
      /** last position */
      Y: number;
      startFingers: number;
    }>({
      totalX: 0,
      totalY: 0,
      X: 0,
      Y: 0,
      startFingers: 0,
    });
    const { width, height } = useMemo(() => Dimensions.get('window'), []);

    return <TapGestureHandler onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            const rightClick = ((nativeEvent.absoluteX / width) < 0.20) && ((nativeEvent.absoluteY / height) > 0.80);
            emitSocket('mouseClick', { button: rightClick ? 'right' : 'left' });
        }
    }} numberOfTaps={1}><TapGestureHandler onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            emitSocket('mouseClick', { double: true });
        }
    }} numberOfTaps={2}><PanGestureHandler
        onGestureEvent={({ nativeEvent }) => {
            const calculatePosition = () => {
                const { totalX, totalY, startFingers} = positionDiff;
                const first = startFingers === 0;

                const diffX = !first ? nativeEvent.absoluteX - positionDiff.X : 0;
                const diffY = !first ? nativeEvent.absoluteY - positionDiff.Y : 0;

                if (positionDiff.startFingers === 1) {
                    emitSocket('moveMouse', { left: diffY * sensitivity, top: -diffX * sensitivity, isDraging });
                } else if (positionDiff.startFingers === 2) {
                    emitSocket('scrollMouse', { x: diffY * sensitivity, y: diffX * sensitivity });
                }

                setPositionDiff({
                    totalX: totalX + diffX,
                    totalY: totalY + diffY,
                    X: nativeEvent.absoluteX,
                    Y: nativeEvent.absoluteY,
                    startFingers: positionDiff.startFingers !== 0  ? positionDiff.startFingers : nativeEvent.numberOfPointers,
                });
            };

            if (nativeEvent.state === State.ACTIVE) {
                // console.log('ACTIVE', positionDiff);
                calculatePosition();
            }
        }}
        onHandlerStateChange={({ nativeEvent }) => {
            // console.log(nativeEvent.state, positionDiff.startFingers);
            if (nativeEvent.state === State.END) {
                // ============  threeFingerSwitchWindow ================
                if (positionDiff.startFingers === 3) {
                    const direction = calculateDirection(calculateAngle(positionDiff.totalX, positionDiff.totalY));
                    if (direction !== 'bottom') {
                        emitSocket('threeFingerSwitchWindow', direction);
                    } else {
                        setIsCloseGestureHandler(true);
                    }
                }
                setPositionDiff({
                    totalX: 0,
                    totalY: 0,
                    X: 0,
                    Y: 0,
                    startFingers: 0,
                  });
                  console.log('mle up');
                if (isDraging) {
                    console.log('mouseToggle up');
                    
                    emitSocket('mouseToggle', { down: 'up' });
                    setIsDraging(false);
                }
            }
        }}
    >{children}</PanGestureHandler></TapGestureHandler></TapGestureHandler>;
}
