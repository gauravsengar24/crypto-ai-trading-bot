const config = require('./modules/configReader');
const db = require('./modules/DB');
bootstrap().catch((e) => {
  console.error(`${config.notifyName} is not started. ${e}`);
  process.exit(1);
});

async function bootstrap() {
  await waitForDbReady();
  initServices();
  startModules();
}

async function waitForDbReady() {
  const timeoutMs = config.db?.options?.serverSelectionTimeoutMS ?? 3000;
  const deadline = Date.now() + timeoutMs + 5000;

  while (!db.db) {
    if (Date.now() > deadline) {
      throw new Error(`MongoDB connection is not ready after ${timeoutMs + 5000} ms.`);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

function initServices() {
  // Socket connection
  if (config.passPhrase) {
    const api = require('./modules/api');
    const txParser = require('./modules/incomingTxsParser');

    if (config.socket) {
      api.initSocket({ wsType: config.ws_type, admAddress: config.address });
      api.socket.on(txParser);
    }
  }

  // Debug and health API init
  const { initApi } = require('./routes/init');
  if (config.api?.port) {
    initApi();
  }
}

function startModules() {
  const notify = require('./helpers/notify');

  if (config.doClearDB) {
    console.log(`${config.notifyName}: Clearing database…`);

    db.systemDb.db.drop();
    db.incomingTxsDb.db.drop();
    db.incomingTgTxsDb.db.drop();
    db.incomingCLITxsDb.db.drop();
    db.ordersDb.db.drop();
    db.fillsDb.db.drop();
    db.webTerminalMessages.drop();

    console.log(`${config.notifyName}: Database cleared. Manually stop the Bot now.`);
    return;
  }

  if (config.passPhrase) {
    const checker = require('./modules/checkerTransactions');
    checker();
  }

  require('./trade/mm_trader').run();
  require('./trade/mm_orderbook_builder').run();
  require('./trade/mm_liquidity_provider').run();
  require('./trade/mm_price_watcher').run();

  if (config.dev) {
    require('./trade/tests/manual.test').run();
  }

  const addressInfo = config.address ? ` for address _${config.address}_` : ' in CLI mode';
  notify(`${config.notifyName} *started*${addressInfo} (${config.projectBranch}, v${config.version}).`, 'info');
}
