import { StyleSheet, ImageStyle } from 'react-native';

const wholeViewStyle: ImageStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export const homePageStyles = StyleSheet.create({
  wholeView: {
    ...wholeViewStyle,
    position: 'relative',
    backgroundColor: 'black',
    color: 'white',
  },

  bottomStick: {
    position: 'absolute',
    width: '100%',
    bottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  canvasView: {
    width: '100%',
    height: '100%',
  },

  sectionContainer: {
    marginTop: 32,

    paddingHorizontal: 24,
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

export const fixedButtonsStyles = (level = 1, left = false) => {
  const postionStyle =
    left === true
      ? {
          left: 5,
        }
      : {
          right: 5,
        };

  return StyleSheet.create({
    style: {
      position: 'absolute',
      top: level * 60,
      height: 36,
      width: 36,
      zIndex: 999,
      ...postionStyle,
    },
  });
};
