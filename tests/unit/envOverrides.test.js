const { applyEnvOverrides } = require('../../modules/config/envOverrides');

describe('applyEnvOverrides', () => {
  it('overrides secret fields from env', () => {
    const config = {
      passPhrase: 'from-config',
      apikey: 'cfg-key',
      apisecret: 'cfg-secret',
      apipassword: 'cfg-pass',
      api: {},
    };

    const env = {
      BOT_PASSPHRASE: 'from-env-passphrase',
      EXCHANGE_API_KEY: 'from-env-key',
      EXCHANGE_API_SECRET: 'from-env-secret',
      EXCHANGE_API_PASSWORD: 'from-env-password',
    };

    const updated = applyEnvOverrides(config, env);

    expect(updated.passPhrase).toBe('from-env-passphrase');
    expect(updated.apikey).toBe('from-env-key');
    expect(updated.apisecret).toBe('from-env-secret');
    expect(updated.apipassword).toBe('from-env-password');
  });

  it('parses debug allowlist from env', () => {
    const updated = applyEnvOverrides({ api: {} }, {
      API_DEBUG_ALLOWLIST: '127.0.0.1,::1, 10.0.0.1 ',
    });

    expect(updated.api.debugAllowlist).toEqual(['127.0.0.1', '::1', '10.0.0.1']);
  });
});
