import spdy from "spdy";
import express from "express";
import compression from "compression";
import next from "next";
import fs from "fs";
import { join } from "path";
import { createProxyMiddleware } from "http-proxy-middleware";

const port = process.env.PORT || "3000";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
// create your own certificate with openssl for development
const options = {
  key: fs.readFileSync(
    join(__dirname, "./privateKey.key")
  ),
  cert: fs.readFileSync(
    join(__dirname, "./certificate.crt")
  ),
};

app
  .prepare()
  .then(() => {
    const expressApp = express();

    // https://github.com/vercel/next.js/blob/master/examples/with-custom-reverse-proxy/package.json
    expressApp.use(
      "/api",
      createProxyMiddleware({
        target: process.env.PROXY,
        changeOrigin: true,
      })
    );

    // set up compression in express
    expressApp.use(
      compression({
        filter: (req, res) => {
          // don't compress responses asking explicitly not
          if (req.headers["x-no-compression"]) {
            return false;
          }

          // use compression filter function
          return compression.filter(req, res);
        },
      })
    );

    // Default catch-all handler to allow Next.js to handle all other routes
    expressApp.all("*", (req, res) => handle(req, res));

    // start the HTTP/2 server with express
    // Reference, https://itnext.io/using-http-2-with-next-js-express-917791ca249b
    spdy.createServer(options, expressApp).listen(parseInt(port, 10), () => {
      console.log(`HTTP/2 server listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the server");
    console.log(err);
  });
