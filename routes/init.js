const express = require('express');
const log = require('../helpers/log');
const config = require('../modules/configReader');
const healthApi = require('./health');
const debugApi = require('./debug');

module.exports = {
  initApi() {
    const app = express();
    const host = config.api.host || '127.0.0.1';

    app.disable('x-powered-by');
    app.use(express.json({ limit: config.api.maxBodySize || '64kb' }));
    app.use(express.urlencoded({ extended: false, limit: config.api.maxBodySize || '64kb' }));

    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Referrer-Policy', 'no-referrer');
      next();
    });

    if (config.api.health) {
      app.use('/', healthApi);
    }

    if (config.api.debug) {
      app.use('/', debugApi);
    }

    app.listen(config.api.port, host, () => {
      log.info(`API server is listening on http://${host}:${config.api.port}. Health enabled: ${config.api.health}. Debug enabled: ${config.api.debug}.`);
    });
  },
};
