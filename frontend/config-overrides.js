const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@shared': path.resolve(__dirname, 'src/components/shared'),
    '@state': path.resolve(__dirname, 'src/state'),
    '@enum': path.resolve(__dirname, 'src/enum'),
    '@api': path.resolve(__dirname, 'src/api'),
  };
  return config;
};
