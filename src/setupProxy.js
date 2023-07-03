const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();
module.exports = function (app) {
  app.use(
    "/api",
    console.log("api url: ", process.env.SERVER_URL),
    createProxyMiddleware({
      target: process.env.SERVER_URL,
      changeOrigin: true,
    })
  );
};
