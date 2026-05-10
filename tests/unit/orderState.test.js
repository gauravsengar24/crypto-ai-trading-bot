const orderState = require('../../trade/orderState');

describe('orderState', () => {
  afterEach(() => {
    orderState.clear();
  });

  it('stores and clears open orders cache', () => {
    orderState.setOpenOrdersCache('ADM/USDT', [{ orderId: '1' }]);
    expect(orderState.getOpenOrdersCache('ADM/USDT').data).toEqual([{ orderId: '1' }]);

    orderState.clear();
    expect(orderState.getOpenOrdersCache('ADM/USDT')).toBeUndefined();
  });

  it('stores balances cache', () => {
    orderState.setBalancesCache([{ code: 'USDT', free: 100 }]);
    expect(orderState.getBalancesCache().data).toEqual([{ code: 'USDT', free: 100 }]);
  });
});
