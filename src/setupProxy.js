const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
  // app.use(
  //   "/api/stripe",
  //   createProxyMiddleware({
  //     target: "http://localhost:4242",
  //     changeOrigin: true,
  //   })
  // );
};
