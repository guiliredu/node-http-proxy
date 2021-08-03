const http = require('http');
const httpProxy = require('http-proxy');
const config = require('./domains.json');

let proxy = httpProxy.createProxyServer();
console.log(new Date, '[SERVER] Started');

let server = http.createServer((req, res) => {
  let host = req.headers.host;

  if (config[host]) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000);

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

// let mock = http.createServer((req, res) => {
//   res.write('ok');
//   res.end();
// }).listen(3030);