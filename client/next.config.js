const withCss = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const plugins = withPlugins([
  [withCss, {}],
], {
  env: {
    TILE_SERVER_HOST: process.env.TILE_SERVER_HOST,
  },
});

module.exports = plugins;
