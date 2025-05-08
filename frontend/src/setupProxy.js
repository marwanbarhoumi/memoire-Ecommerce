const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/products',
    createProxyMiddleware({
      target: 'http://localhost:7003',
      changeOrigin: true,
      pathRewrite: { '^/api/products': '' },
    })
  );

  app.use(
    '/api/users',
    createProxyMiddleware({
      target: 'http://localhost:7004',
      changeOrigin: true,
      pathRewrite: { '^/api/users': '' },
    })
  );
};
