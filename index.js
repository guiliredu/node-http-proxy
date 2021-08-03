const http = require('http');
const httpProxy = require('http-proxy');
const config = require('./domains.json');

let proxy = httpProxy.createProxyServer();
console.log(new Date, '[SERVER] Started');

let server = http.createServer((req, res) => {
  let host = req.headers.host;

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (config[host]) {
    console.log(new Date, `[REQUEST] Proxied from ${host} to ${config[host]}`);
    return proxy.web(req, res, {
      target: `http://localhost:${config[host]}`,
      secure: false
    });
  }

  console.error(new Date, '[REQUEST] Host not found', host);
  res.statusCode = 404;
  res.end();
}).listen(80);

proxy.on('error', (err, req, res) => {
  console.error(new Date, '[ERROR] ', err);
  res.statusCode = 404;
  res.end();
});