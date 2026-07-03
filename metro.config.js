const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure SVG and image assets are handled properly for web
const { assetExts } = config.resolver;
config.resolver.assetExts = [...assetExts, 'svg'];

module.exports = config;
