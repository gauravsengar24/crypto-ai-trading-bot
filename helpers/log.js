const config = require('../modules/configReader');
const dateTime = require('./dateTime');

const fs = require('fs');
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

const infoStr = fs.createWriteStream('./logs/' + dateTime.date() + '.log', {
  flags: 'a',
});

infoStr.write(`\n\n[The bot started] _________________${dateTime.fullTime()}_________________\n`);

const REDACTION_PATTERNS = [
  /(authorization["']?\s*[:=]\s*["']?)([^"',\s}]+)/gi,
  /(api[-_]?key["']?\s*[:=]\s*["']?)([^"',\s}]+)/gi,
  /(api[-_]?secret["']?\s*[:=]\s*["']?)([^"',\s}]+)/gi,
  /(passphrase["']?\s*[:=]\s*["']?)([^"',\s}]+)/gi,
  /(secret(_key)?["']?\s*[:=]\s*["']?)([^"',\s}]+)/gi,
  /(token["']?\s*[:=]\s*["']?)([^"',\s}]+)/gi,
];

function redactString(value) {
  let result = value;

  REDACTION_PATTERNS.forEach((pattern) => {
    result = result.replace(pattern, (match, prefix) => `${prefix}[REDACTED]`);
  });

  return result;
}

function toLogSafeString(payload) {
  if (payload === undefined || payload === null) return String(payload);
  if (typeof payload === 'string') return redactString(payload);

  try {
    return redactString(JSON.stringify(payload));
  } catch {
    return redactString(String(payload));
  }
}

module.exports = {
  redact(payload) {
    return toLogSafeString(payload);
  },
  error(str) {
    if (['error', 'warn', 'info', 'log'].includes(config.log_level)) {
      const safeMessage = toLogSafeString(str);
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[31m', 'error|' + dateTime.fullTime(), '\x1b[0m', safeMessage);
      }
      infoStr.write('\n ' + 'error|' + dateTime.fullTime() + '|' + safeMessage);
    }
  },
  warn(str) {
    if (['warn', 'info', 'log'].includes(config.log_level)) {
      const safeMessage = toLogSafeString(str);
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[33m', 'warn|' + dateTime.fullTime(), '\x1b[0m', safeMessage);
      }
      infoStr.write('\n ' + 'warn|' + dateTime.fullTime() + '|' + safeMessage);
    }
  },
  info(str) {
    if (['info', 'log'].includes(config.log_level)) {
      const safeMessage = toLogSafeString(str);
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[32m', 'info|' + dateTime.fullTime(), '\x1b[0m', safeMessage);
      }
      infoStr.write('\n ' + 'info|' + dateTime.fullTime() + '|' + safeMessage);
    }
  },
  log(str) {
    if (['log'].includes(config.log_level)) {
      const safeMessage = toLogSafeString(str);
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[34m', 'log|' + dateTime.fullTime(), '\x1b[0m', safeMessage);
      }
      infoStr.write('\n ' + 'log|' + dateTime.fullTime() + '|' + safeMessage);
    }
  },
};
