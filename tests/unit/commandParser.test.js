const { parseCommand } = require('../../modules/commandParser');

describe('commandParser', () => {
  it('parses a basic command', () => {
    const parsed = parseCommand('/help', {});

    expect(parsed.commandName).toBe('help');
    expect(parsed.group).toEqual([]);
    expect(parsed.aliasedCommand).toBeNull();
  });

  it('expands aliases before parsing', () => {
    const aliases = {
      h: () => '/help',
    };

    const parsed = parseCommand('/h', aliases);

    expect(parsed.commandName).toBe('help');
    expect(parsed.group).toEqual([]);
    expect(parsed.aliasedCommand).toBe('/help');
  });
});
