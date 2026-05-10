const secretEnvOverrideMap = {
  passPhrase: 'BOT_PASSPHRASE',
  manageTelegramBotToken: 'MANAGE_TELEGRAM_BOT_TOKEN',
  apikey: 'EXCHANGE_API_KEY',
  apisecret: 'EXCHANGE_API_SECRET',
  apipassword: 'EXCHANGE_API_PASSWORD',
  apikey2: 'EXCHANGE_API_KEY_2',
  apisecret2: 'EXCHANGE_API_SECRET_2',
  apipassword2: 'EXCHANGE_API_PASSWORD_2',
  com_server_secret_key: 'COM_SERVER_SECRET_KEY',
};

function applyEnvOverrides(config, env = process.env) {
  const output = { ...config };

  Object.entries(secretEnvOverrideMap).forEach(([configField, envName]) => {
    const envValue = env[envName];
    if (typeof envValue === 'string' && envValue.length > 0) {
      output[configField] = envValue;
    }
  });

  output.api = {
    ...(output.api || {}),
  };

  if (env.API_HOST) {
    output.api.host = env.API_HOST;
  }

  if (env.API_DEBUG_TOKEN) {
    output.api.debugToken = env.API_DEBUG_TOKEN;
  }

  if (env.API_DEBUG_ALLOWLIST) {
    output.api.debugAllowlist = env.API_DEBUG_ALLOWLIST
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
  }

  return output;
}

module.exports = {
  applyEnvOverrides,
};
