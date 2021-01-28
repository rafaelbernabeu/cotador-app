const proxy = [
  {
    context: '/',
    target: 'http://cotador-saude.herokuapp.com',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
];

module.exports = proxy;
