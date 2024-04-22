const path = require('path');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          net: require.resolve('net-browserify'),
          tls: require.resolve('tls-browserify'),
          stream: require.resolve('stream-browserify'),
          timers: require.resolve('timers-browserify'),
          "path": require.resolve("path-browserify"),
          "http": require.resolve("stream-http"),
          "querystring": require.resolve("querystring-es3"),
          "zlib": require.resolve("browserify-zlib"),
            fs: false // No hay polyfill para el módulo 'fs', así que lo establecemos en false
        }
      }
    }
  }
};
