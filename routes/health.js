const { Router } = require('express');
const db = require('../modules/DB');

const router = new Router();

router.get('/ping', (req, res) => {
  const dbReady = Boolean(db.db);
  const status = dbReady ? 200 : 503;

  res.status(status).send({
    ok: dbReady,
    timestamp: Date.now(),
    dbReady,
  });
});

module.exports = router;
