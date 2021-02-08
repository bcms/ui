const { BCMSConfigBuilder } = require('@becomes/cms-bundler');

module.exports = BCMSConfigBuilder({
  backend: {
    port: 1280,
    security: {
      jwt: {
        issuer: 'localhost',
        secret: 'secret',
      },
    },
    database: {
      fs: 'bcms',
    },
  },
  plugins: [],
});
