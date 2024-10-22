const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@shared': path.resolve(__dirname, 'src/components/shared'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@enum': path.resolve(__dirname, 'src/enum'),
      '@type': path.resolve(__dirname, 'src/type'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@hook': path.resolve(__dirname, 'src/hook'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@constant': path.resolve(__dirname, 'src/constant'),
    },
  },
};
