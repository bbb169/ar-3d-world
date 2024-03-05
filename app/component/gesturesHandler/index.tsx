import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import { Direction } from '../../../constants/type';
import { emitSocket } from '../../utils/socket';
import { Dimensions, Vibration } from 'react-native';

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

let newMoveStatrt = false;

function getInertiaDistance({ finalVelocityX, finalVelocityY, timeStep } : { finalVelocityX?: number, finalVelocityY?: number, timeStep: number }) {
    const decelerationRate = 0.9;
    // 初始化速度为初始速度
    const velocity = finalVelocityX || finalVelocityY || 0;
    // 每次迭代，速度都会递减
    function scroll(velocity: number, times: number) {
        if (Math.abs(velocity) < 0.1 || times > 50 || newMoveStatrt) {
            return;
        }
        // 计算当前速度对应的位移
        const distance = velocity * timeStep * 0.3;

        if (finalVelocityX) {
            emitSocket('scrollMouse', { x: 0, y: distance });
        } else if (finalVelocityY) {
            emitSocket('scrollMouse', { x: -distance, y: 0 });
        }
        // 根据减速率更新速度
        velocity *= decelerationRate;

        setTimeout(() => {
            scroll(velocity, times + 1);
        }, 20);
    }

    const absoluteValue = Math.abs(velocity);

    if (absoluteValue > 200) {
        if (velocity > 0) {
            scroll(Math.floor(Math.sqrt(absoluteValue)), 1);
        } else {
            scroll(-Math.floor(Math.sqrt(absoluteValue)), 1);
        }
    }
}

function limitLessMoveDis(value: number) {
    const lessDiss = 0.7;

    if (value === 0) {
        return 0;
    }

    if (value > 0) {
        return Math.max(lessDiss, value);
    }
        return Math.min(-lessDiss, value);
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
      velocityX: number;
      velocityY: number;
      /** last position */
      X: number;
      /** last position */
      Y: number;
      startFingers: number;
    }>({
      totalX: 0,
      totalY: 0,
      velocityX: 0,
      velocityY: 0,
      X: 0,
      Y: 0,
      startFingers: 0,
    });
    const { width, height } = useMemo(() => Dimensions.get('window'), []);
    const calculateDisByVelocitySensitivity = useCallback((velocity: number) => {
        return sensitivity * Math.max(1, Math.abs(velocity / 500));
    }, [sensitivity]);

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

                if (first) {
                    newMoveStatrt = true;
                }
                // ============= add speed velocity factor ==============
                const moveDisFactorX = calculateDisByVelocitySensitivity(nativeEvent.velocityX)
                ;
                const moveDisFactorY = calculateDisByVelocitySensitivity(nativeEvent.velocityY);

                let diffX = !first ? nativeEvent.absoluteX - positionDiff.X : 0;
                let diffY = !first ? nativeEvent.absoluteY - positionDiff.Y : 0;

                // ==================== handle distance in low speed ===========
                const isHighSpeedMovement = (Math.abs(nativeEvent.velocityX) > 150 || Math.abs(nativeEvent.velocityY) > 150);

                if (diffX && (Math.abs(diffX) / Math.abs(diffY) < 0.1) && !isHighSpeedMovement) {
                    diffX = 0;
                } else if (diffY && (Math.abs(diffY) / Math.abs(diffX) < 0.1) && !isHighSpeedMovement) {
                    diffY = 0;
                }

                if (positionDiff.startFingers === 1 && nativeEvent.numberOfPointers === 1) {
                    emitSocket('moveMouse', { left: limitLessMoveDis(diffY * moveDisFactorY), top: -limitLessMoveDis(diffX * moveDisFactorX), isDraging });
                } else if (positionDiff.startFingers === 2 && nativeEvent.numberOfPointers === 2) {
                    const isYBigger = Math.abs(totalY) > Math.abs(totalX);

                    if (isYBigger) {
                        if (positionDiff.velocityY === 0) {
                            return;
                        }
                    } else {
                        if (positionDiff.velocityX === 0) {
                            return;
                        }
                    }
                    emitSocket('scrollMouse', { x: isYBigger ? (-diffY * moveDisFactorY) / 2 : 0, y: !isYBigger ? (diffX * moveDisFactorX) / 2 : 0 });
                } else if (positionDiff.startFingers === 0 && nativeEvent.numberOfPointers === 3) {
                    Vibration.vibrate([0, 50]);
                }

                if (positionDiff.startFingers !== 0 && positionDiff.startFingers !== nativeEvent.numberOfPointers) {
                    return;
                }

                setPositionDiff({
                    totalX: totalX + diffX,
                    totalY: totalY + diffY,
                    velocityX: nativeEvent.velocityX,
                    velocityY: nativeEvent.velocityY,
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


                    if (direction !== 'bottom') {
                        emitSocket('threeFingerSwitchWindow', direction);
                    } else {
                        setIsCloseGestureHandler(true);
                    }
                } else if (positionDiff.startFingers === 2) {
                    const isXBigger = Math.abs(positionDiff.velocityX) > Math.abs(positionDiff.velocityY);
                    const finalVelocity = Math.max(positionDiff.velocityX, positionDiff.velocityY);

                    newMoveStatrt = false;
                    getInertiaDistance({ finalVelocityX: isXBigger ? positionDiff.velocityX : 0, finalVelocityY: isXBigger ? 0 : positionDiff.velocityY, timeStep: calculateDisByVelocitySensitivity(finalVelocity) });
                }
                setPositionDiff({
                    totalX: 0,
                    totalY: 0,
                    velocityX: 0,
                    velocityY: 0,
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
