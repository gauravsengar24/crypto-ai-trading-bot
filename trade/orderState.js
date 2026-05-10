const state = {
  openOrdersCached: [],
  openOrdersValidMs: 1000,
  orderBookCached: [],
  orderBookCachedValidMs: 1000,
  balancesCached: { timestamp: 0, data: [] },
  balancesCachedValidMs: 1000,
};

module.exports = {
  getOpenOrdersCache(pair) {
    return state.openOrdersCached[pair];
  },
  setOpenOrdersCache(pair, data) {
    state.openOrdersCached[pair] = {
      data,
      timestamp: Date.now(),
    };
  },
  getOpenOrdersValidMs() {
    return state.openOrdersValidMs;
  },
  getOrderBookCache(pair) {
    return state.orderBookCached[pair];
  },
  setOrderBookCache(pair, data) {
    state.orderBookCached[pair] = {
      data,
      timestamp: Date.now(),
    };
  },
  getOrderBookValidMs() {
    return state.orderBookCachedValidMs;
  },
  getBalancesCache() {
    return state.balancesCached;
  },
  setBalancesCache(data) {
    state.balancesCached = {
      data,
      timestamp: Date.now(),
    };
  },
  getBalancesValidMs() {
    return state.balancesCachedValidMs;
  },
  clear() {
    state.openOrdersCached = [];
    state.orderBookCached = [];
    state.balancesCached = { timestamp: 0, data: [] };
  },
};
