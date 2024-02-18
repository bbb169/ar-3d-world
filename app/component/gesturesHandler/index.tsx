import React, { ReactNode, useMemo, useState } from 'react';
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import { Direction } from '../../../constants/type';
import { emitSocket } from '../../utils/socket';
import { Dimensions } from 'react-native';
import { Vibration } from 'react-native';

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
    if ((angle <= 45 && angle >= 0) || (angle > -45 && angle <= 0)) {
        return 'top';
    } else if (angle > 45 && angle <= 135) {
        return 'right';
    } else if (angle < -135 || angle > 135) {
        return 'bottom';
    } else if (angle < -45 && angle > -135) {
        return 'left';
    }
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

                // ============= add speed velocity factor ==============
                const moveDisFactorX = sensitivity * Math.max(1, Math.abs(nativeEvent.velocityX / 500));
                const moveDisFactorY = sensitivity * Math.max(1, Math.abs(nativeEvent.velocityY / 500));

                let diffX = !first ? nativeEvent.absoluteX - positionDiff.X : 0;
                let diffY = !first ? nativeEvent.absoluteY - positionDiff.Y : 0;

                // ==================== handle distance in low speed ===========
                const isHighSpeedMovement = (Math.abs(nativeEvent.velocityX) > 150 || Math.abs(nativeEvent.velocityY) > 150);

                if (diffX && diffX / diffY < 0.1 && !isHighSpeedMovement) {
                    diffX = 0;
                } else if (diffY && diffY / diffX < 0.1 && !isHighSpeedMovement) {
                    diffY = 0;
                }

                if (positionDiff.startFingers === 1 && nativeEvent.numberOfPointers === 1) {
                    emitSocket('moveMouse', { left: diffY * moveDisFactorY, top: -diffX * moveDisFactorX, isDraging });
                } else if (positionDiff.startFingers === 2 && nativeEvent.numberOfPointers === 2) {
                    const isXBigger = Math.abs(diffY) > Math.abs(diffX);
                    emitSocket('scrollMouse', { x: isXBigger ? diffY * moveDisFactorY : 0, y: !isXBigger ? diffX * moveDisFactorX : 0 });
                } else if (positionDiff.startFingers === 0 && nativeEvent.numberOfPointers === 3) {
                    Vibration.vibrate([0, 50]);
                }

                console.log(totalX + diffX, totalY + diffY);

                setPositionDiff({
                    totalX: totalX + diffX,
                    totalY: totalY + diffY,
                    X: nativeEvent.absoluteX,
                    Y: nativeEvent.absoluteY,
                    startFingers: positionDiff.startFingers !== 0  ? positionDiff.startFingers : nativeEvent.numberOfPointers,
                });
            };

            if (nativeEvent.state === State.ACTIVE) {
                calculatePosition();
            }
        }}
        onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END) {
                // ============  threeFingerSwitchWindow ================
                if (positionDiff.startFingers === 3) {
                    const direction = calculateDirection(calculateAngle(positionDiff.totalX, positionDiff.totalY));
                    console.log(direction, positionDiff);
                    
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
                if (isDraging) {
                    emitSocket('mouseToggle', { down: 'up' });
                    setIsDraging(false);
                }
            }
        }}
    >{children}</PanGestureHandler></TapGestureHandler></TapGestureHandler>;
}
