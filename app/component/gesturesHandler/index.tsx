import React, { ReactNode, useState } from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Direction } from '../../../constants/type';

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

export function GesturesHandler({ children }: { children: ReactNode }) {
    const [gestures, setGestures] = useState<string[]>([]);
    const [positionDiff, setPositionDiff] = useState<{
      /** total moved distance in X axis */
      totalX: number;
      /** total moved distance in Y axis */
      totalY: number;
      /** last position */
      X: number;
      /** last position */
      Y: number;
    }>({
      totalX: 0,
      totalY: 0,
      X: 0,
      Y: 0,
    });


    return <PanGestureHandler
        onGestureEvent={({ nativeEvent }) => {
            const calculatePosition = () => {
                const { totalX, totalY, X, Y } = positionDiff;
                const first = totalX === 0 && totalY === 0 && X === 0 && Y === 0;

                const diffX = !first ? nativeEvent.absoluteX - positionDiff.X : 0;
                const diffY = !first ? nativeEvent.absoluteY - positionDiff.Y : 0;
                setPositionDiff({
                    totalX: totalX + diffX,
                    totalY: totalY + diffY,
                    X: nativeEvent.absoluteX,
                    Y: nativeEvent.absoluteY,
                });
            };

            if (nativeEvent.state === State.BEGAN) {
                // 获取触摸点的数量
                const numberOfTouches = nativeEvent.numberOfPointers;
                // 如果触摸点的数量为3，表示三指滑动
                if (numberOfTouches >= 3) {
                    // 处理三指滑动手势事件
                    setGestures(Array.from(new Set(gestures).add('Three Finger Swipe')));
                } else {
                    setGestures(Array.from(new Set(gestures).add('Pan')));
                }
                // console.log('BEGAN', positionDiff);

                calculatePosition();
            } else if (nativeEvent.state === State.ACTIVE) {
                // console.log('ACTIVE', positionDiff);
                calculatePosition();
            } else if (nativeEvent.state === State.CANCELLED) {
                setPositionDiff({
                  totalX: 0,
                  totalY: 0,
                  X: 0,
                  Y: 0,
                });
            }
        }}
        onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END) {
                console.log('END', positionDiff, calculateDirection(calculateAngle(positionDiff.totalX, positionDiff.totalY)));

                setPositionDiff({
                    totalX: 0,
                    totalY: 0,
                    X: 0,
                    Y: 0,
                  });
                setGestures([]);
            }
        }}
    >{children}</PanGestureHandler>;
}
