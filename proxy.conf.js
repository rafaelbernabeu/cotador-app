const proxy = [
  {
    context: '/',
    target: 'http://localhost:8080',
    secure: false,
    logLevel: 'debug'
  }
];

module.exports = proxy;
