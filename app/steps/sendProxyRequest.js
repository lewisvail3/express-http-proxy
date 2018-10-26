'use strict';

// I don't think that request-promise is going to work because pipe is a performance issue.
// Go ahead and go back to `request` here

var request = require('request');
var chunkLength = require('../../lib/chunkLength');

function sendProxyRequest(Container) {
  var req = Container.user.req;
  var bodyContent = Container.proxy.bodyContent;
  var reqOpt = Container.proxy.reqBuilder;
  var options = Container.options;


  // TODO: this should go out of here to the reqOptBuilder, but at the moment I'm letting it ride here.
  const roptions = {
    method: req.method,
    uri: reqOpt.protocol + '//' + reqOpt.host + ':' + reqOpt.port + reqOpt.path,
    headers: reqOpt.headers,
    resolveWithFullResponse: true
  };

  if (options.timeout) {
    roptions.timeout = options.timeout;
  }

  // SHOULD this be bodyContent instead?
  if (req.body) {
    roptions.body = req.body;
    if (typeof req.body === 'object') {
      roptions.json = true;
    }
  }

  return new Promise((resolve, reject) => {
    let proxyReq = request(roptions, (error, response, body) => {
      if (error) { reject(error); }
      Container.proxy.res = response;
      Container.proxy.resData = body;
      Container.proxy.req = proxyReq;
      resolve(Container);
    });
  });


  //return new Promise(function (resolve, reject) {
    //var protocol = Container.proxy.requestModule;
    //var proxyReq = Container.proxy.req = protocol.request(reqOpt, function (rsp) {
      //// TODO: Need to get this streaming functionality back in place

      //if (options.stream) {
        //Container.proxy.res = rsp;
        //return resolve(Container);
      //}

      //var chunks = [];
      //rsp.on('data', function (chunk) { chunks.push(chunk); });
      //rsp.on('end', function () {
        //Container.proxy.res = rsp;
        //Container.proxy.resData = Buffer.concat(chunks, chunkLength(chunks));
        //resolve(Container);
      //});
      //rsp.on('error', reject);
    //});

    //// TODO: need to get this socket timeout working as well

    //proxyReq.on('socket', function (socket) {
      //if (options.timeout) {
        //socket.setTimeout(options.timeout, function () {
          //proxyReq.abort();
        //});
      //}
    //});

    //proxyReq.on('error', reject);

    //if (options.parseReqBody) {
      //if (bodyContent.length) {
        //var body = bodyContent;
        //var contentType = proxyReq.getHeader('Content-Type');
        //if (contentType === 'x-www-form-urlencoded' || contentType === 'application/x-www-form-urlencoded') {
          //try {
            //var params = JSON.parse(body);
            //body = Object.keys(params).map(function (k) { return k + '=' + params[k]; }).join('&');
          //} catch (e) {
            //// bodyContent is not json-format
          //}
        //}
        //proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
        //proxyReq.write(body);
      //}
      //proxyReq.end();
    //} else {
    //// Pipe will call end when it has completely read from the request.

      //req.pipe(proxyReq);
    //}


    //// TODO: need to get this guy too

    //req.on('aborted', function () {
    //// reject?

      //proxyReq.abort();
    //});
  //});
}


module.exports = sendProxyRequest;
