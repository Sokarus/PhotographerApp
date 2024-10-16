const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@shared': path.resolve(__dirname, 'src/components/shared'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@enum': path.resolve(__dirname, 'src/enum'),
      '@api': path.resolve(__dirname, 'src/api'),
    },
  },
};