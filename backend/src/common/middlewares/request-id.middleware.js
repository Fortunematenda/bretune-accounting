const crypto = require('crypto');

function requestIdMiddleware(req, res, next) {
  const existing = req.headers['x-request-id'];
  const requestId = existing || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  next();
}

module.exports = { requestIdMiddleware };
