function normalizeCommandText(commandMsg) {
  return commandMsg
      .trim()
      .replace(/ {2,}/g, ' ');
}

function tokenize(commandMsg) {
  return normalizeCommandText(commandMsg).split(' ');
}

function parseCommand(commandMsg, aliases) {
  let group = tokenize(commandMsg);
  let commandName = group.shift().trim().toLowerCase().replace('/', '');

  const alias = aliases[commandName];
  if (alias) {
    const aliasedCommand = alias(group);
    group = tokenize(aliasedCommand);
    commandName = group.shift().trim().toLowerCase().replace('/', '');
    return { group, commandName, aliasedCommand };
  }

  return { group, commandName, aliasedCommand: null };
}

module.exports = {
  parseCommand,
  normalizeCommandText,
};
