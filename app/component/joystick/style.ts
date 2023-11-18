import { StyleSheet } from 'react-native';

export const joystickStyles = (x: number, y: number, nippleRadius: number, color: string) => {
  return StyleSheet.create({
    centerButton: {
      height: 2 * nippleRadius,
      width: 2 * nippleRadius,
      borderRadius: nippleRadius,
      backgroundColor: `${color}bb`,
      position: 'absolute',
      transform: [
        {
          translateX: x,
        },
        { translateY: y },
      ],
    },
  });
};
