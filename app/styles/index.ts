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
