const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/login',
    createProxyMiddleware({
      target: 'http://localhost:7002',
      changeOrigin: true,
      pathRewrite: { '^/api/login': '' },
    })
  );
  
  app.use(
    '/api/products',
    createProxyMiddleware({
      target: 'http://localhost:7100',
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
