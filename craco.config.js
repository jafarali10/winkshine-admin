const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: false,
          stream: false,
          buffer: false,
          util: false,
          vm: false,
          assert: false,
          fs: false,
          path: false,
          os: false,
        },
      },
    },
  },
}; 