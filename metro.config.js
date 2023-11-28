// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
  resolver: {
    assetExts: ['db', 'mp3', 'ttf', 'obj', 'png', 'jpg'],
  },
});

module.exports = config;
