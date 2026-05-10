const { Router } = require('express');
const db = require('../modules/DB');
const config = require('../modules/configReader');

const router = new Router();

function getRemoteIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || '';
}

function isAllowedIp(ip, allowedIps = []) {
  if (!allowedIps?.length) return true;
  return allowedIps.includes(ip);
}

function hasValidDebugToken(req, token) {
  if (!token) return false;
  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const customHeader = req.headers['x-debug-token'];
  return bearer === token || customHeader === token;
}

router.use((req, res, next) => {
  const remoteIp = getRemoteIp(req);
  const allowlist = config.api.debugAllowlist ?? [];

  if (!isAllowedIp(remoteIp, allowlist)) {
    res.status(403).json({ success: false, err: 'Forbidden IP.' });
    return;
  }

  if (!hasValidDebugToken(req, config.api.debugToken)) {
    res.status(401).json({ success: false, err: 'Unauthorized.' });
    return;
  }

  next();
});

router.get('/db', (req, res) => {
  const tableName = req.query.tb;
  if (typeof tableName !== 'string' || !tableName) {
    res.status(400).json({ success: false, err: 'tb is required' });
    return;
  }

  const tableModel = db[tableName];
  const tb = tableModel?.db;

  if (!tb) {
    res.status(404).json({ success: false, err: 'tb not found' });
    return;
  }

  tb.find().toArray()
      .then((result) => {
        res.json({
          result,
          success: true,
        });
      })
      .catch((err) => {
        res.json({
          err,
          success: false,
        });
      });
});

module.exports = router;
