module.exports = {
  port: 8080,
  local: true,
  jwt: {
    scope: 'localhost',
    secret: 'secret',
    expireIn: 300000000,
  },
  database: {
    prefix: 'bcms',
    fs: true,
  },
  plugins: [],
};
