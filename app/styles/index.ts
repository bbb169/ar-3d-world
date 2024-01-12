import { StyleSheet } from 'react-native';

export const publicStyles = StyleSheet.create({
  displayCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 24,

    fontWeight: '600',
  },

  sectionDescription: {
    marginTop: 8,

    fontSize: 18,

    fontWeight: '400',
  },

  highlight: { fontWeight: '700' },
});

export const buttonStyles = (size = 32) => StyleSheet.create({
  primaryButton: {
    backgroundColor: '#1677ff',
    color: '#fff',
    height: size,
    lineHeight: size,
    borderRadius: 8,
    overflow: 'hidden',
    ...publicStyles.displayCenter,
  },

  circleButton: {
    width: size,
    height: size,
    borderRadius: size,
    overflow: 'hidden',
  },
});