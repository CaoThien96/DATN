const config = {
  app: {
    port: 8000,
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'attendance',
  },
  jwtSecret: 'jwtSecret',
};

module.exports = config;
